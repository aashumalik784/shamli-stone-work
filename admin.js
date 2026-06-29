// ============================================
// ADMIN PANEL FUNCTIONALITY
// ============================================

// Check authentication
(async function() {
    const session = await checkAuth();
    if (!session) {
        window.location.href = 'login.html';
    } else {
        loadStats();
    }
})();

// Load categories into dropdown
async function loadCategories() {
    const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .order('name');
    
    if (error) {
        console.error('Error loading categories:', error);
        alert('Error loading categories. Please refresh the page.');
        return;
    }
    
    const categorySelect = document.getElementById('category');
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Load statistics
async function loadStats() {
    // Total photos
    const { count: totalPhotos } = await supabaseClient
        .from('photos')
        .select('*', { count: 'exact', head: true });
    
    document.getElementById('total-photos').textContent = totalPhotos || 0;
    
    // Total categories
    const { count: totalCategories } = await supabaseClient
        .from('categories')
        .select('*', { count: 'exact', head: true });
    
    document.getElementById('total-categories').textContent = totalCategories || 0;
    
    // Today's uploads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: todayUploads } = await supabaseClient
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
    
    document.getElementById('today-uploads').textContent = todayUploads || 0;
}

loadCategories();

// Photo preview functionality
let selectedFiles = [];
const photoInput = document.getElementById('photo-input');
const previewContainer = document.getElementById('preview-container');

photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    displayPreviews();
});

function displayPreviews() {
    previewContainer.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-btn" onclick="removePhoto(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function removePhoto(index) {
    selectedFiles.splice(index, 1);
    displayPreviews();
}

// Upload photos
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoryId = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const uploadBtn = document.getElementById('upload-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const successMessage = document.getElementById('success-message');
    
    if (!categoryId) {
        alert('Please select a category');
        return;
    }
    
    if (selectedFiles.length === 0) {
        alert('Please select at least one photo');
        return;
    }
    
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    progressBar.style.display = 'block';
    
    let uploadedCount = 0;
    const totalFiles = selectedFiles.length;
    
    try {
        for (const file of selectedFiles) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('photos')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('photos')
                .getPublicUrl(filePath);
            
            // Insert into database
            const { error: insertError } = await supabaseClient
                .from('photos')
                .insert({
                    category_id: categoryId,
                    title: title || file.name,
                    description: description,
                    image_url: publicUrl
                });
            
            if (insertError) throw insertError;
            
            uploadedCount++;
            const progress = Math.round((uploadedCount / totalFiles) * 100);
            progressFill.style.width = `${progress}%`;
            progressFill.textContent = `${progress}% (${uploadedCount}/${totalFiles})`;
        }
        
        // Success
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 4000);
        
        // Reset form
        document.getElementById('upload-form').reset();
        selectedFiles = [];
        previewContainer.innerHTML = '';
        
        // Reload stats
        loadStats();
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading photos: ' + error.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Photos';
        setTimeout(() => {
            progressBar.style.display = 'none';
            progressFill.style.width = '0%';
        }, 1500);
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
});
