// ============================================
// GALLERY DYNAMIC LOADING
// ============================================

let allPhotos = [];
let allCategories = [];

// Load all data from Supabase
async function loadGalleryData() {
    try {
        // Load categories
        const { data: categories, error: catError } = await supabaseClient
            .from('categories')
            .select('*')
            .order('name');
        
        if (catError) throw catError;
        allCategories = categories;
        
        // Load all photos with category info
        const { data: photos, error: photoError } = await supabaseClient
            .from('photos')
            .select(`
                *,
                categories (
                    name,
                    slug,
                    icon
                )
            `)
            .order('created_at', { ascending: false });
        
        if (photoError) throw photoError;
        allPhotos = photos;
        
        // Render filter buttons
        renderFilterButtons();
        
        // Render gallery
        renderGallery();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        document.getElementById('gallery-container').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem;"></i>
                <p style="margin-top: 20px; font-size: 1.2rem;">Error loading gallery. Please refresh the page.</p>
            </div>
        `;
    }
}

// Render filter buttons
function renderFilterButtons() {
    const filterContainer = document.querySelector('.gallery-filter .container');
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    
    allCategories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', category.slug);
        btn.textContent = category.name;
        filterContainer.appendChild(btn);
    });
    
    // Add event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });
}

// Render gallery
function renderGallery(filteredPhotos = null) {
    const container = document.getElementById('gallery-container');
    const photosToShow = filteredPhotos || allPhotos;
    
    if (photosToShow.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-images" style="font-size: 4rem; color: #ccc;"></i>
                <p style="margin-top: 20px; font-size: 1.3rem; color: #666;">No photos found in this category</p>
            </div>
        `;
        return;
    }
    
    // Group photos by category
    const photosByCategory = {};
    photosToShow.forEach(photo => {
        const slug = photo.categories.slug;
        if (!photosByCategory[slug]) {
            photosByCategory[slug] = {
                category: photo.categories,
                photos: []
            };
        }
        photosByCategory[slug].photos.push(photo);
    });
    
    // Render each category
    container.innerHTML = '';
    Object.values(photosByCategory).forEach(({ category, photos }) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'gallery-category';
        categoryDiv.id = category.slug;
        
        categoryDiv.innerHTML = `
            <h2 class="category-title">
                <i class="${category.icon}"></i> ${category.name} Gallery (${photos.length})
            </h2>
            <div class="gallery-grid">
                ${photos.map(photo => `
                    <div class="gallery-item" data-category="${category.slug}">
                        <img src="${photo.image_url}" alt="${photo.title || category.name}" loading="lazy">
                        <div class="overlay">
                            <h3>${photo.title || category.name}</h3>
                            ${photo.description ? `<p>${photo.description}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(categoryDiv);
    });
    
    // Attach lightbox listeners
    attachLightboxListeners();
}

// Filter gallery
function filterGallery(filterValue) {
    if (filterValue === 'all') {
        renderGallery();
    } else {
        const filteredPhotos = allPhotos.filter(photo => photo.categories.slug === filterValue);
        renderGallery(filteredPhotos);
    }
}

// Lightbox functionality
function attachLightboxListeners() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3').textContent;
            
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
            lightboxCaption.textContent = title;
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Load gallery when page loads
loadGalleryData();
