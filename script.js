class ColorPickerApp {
    constructor() {
        this.colorInput = document.getElementById('colorInput');
        this.colorDisplay = document.getElementById('colorDisplay');
        this.colorValue = document.getElementById('colorValue');
        this.savedColorsContainer = document.getElementById('savedColors');
        this.saveColorBtn = document.getElementById('saveColorBtn');
        this.clearColorsBtn = document.getElementById('clearColorsBtn');
        
        this.savedColors = this.loadSavedColors();
        
        this.init();
    }

    init() {
        // Set initial color
        this.updateColor(this.colorInput.value);
        
        // Event listeners
        this.colorInput.addEventListener('input', (e) => {
            this.updateColor(e.target.value);
        });

        this.saveColorBtn.addEventListener('click', () => {
            this.saveCurrentColor();
        });

        this.clearColorsBtn.addEventListener('click', () => {
            this.clearAllColors();
        });

        // Display saved colors
        this.displaySavedColors();
    }

    updateColor(color) {
        // Update color display
        this.colorDisplay.style.backgroundColor = color;
        this.colorValue.textContent = color.toUpperCase();
        
        // Update background with a subtle tint
        const rgb = this.hexToRgb(color);
        if (rgb) {
            document.body.style.background = `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`;
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    saveCurrentColor() {
        const currentColor = this.colorInput.value.toUpperCase();
        
        // Check if color already exists
        if (!this.savedColors.includes(currentColor)) {
            this.savedColors.push(currentColor);
            this.saveSavedColors();
            this.displaySavedColors();
            
            // Show feedback
            this.showFeedback('Color saved!');
        } else {
            this.showFeedback('Color already saved!');
        }
    }

    displaySavedColors() {
        this.savedColorsContainer.innerHTML = '';
        
        if (this.savedColors.length === 0) {
            this.savedColorsContainer.innerHTML = '<div class="empty-state">No saved colors yet</div>';
            return;
        }

        this.savedColors.forEach((color, index) => {
            const colorElement = document.createElement('div');
            colorElement.className = 'saved-color';
            colorElement.style.backgroundColor = color;
            colorElement.title = color;
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteSavedColor(index);
            };
            
            colorElement.appendChild(deleteBtn);
            
            // Click to select color
            colorElement.addEventListener('click', () => {
                this.colorInput.value = color;
                this.updateColor(color);
            });
            
            this.savedColorsContainer.appendChild(colorElement);
        });
    }

    deleteSavedColor(index) {
        this.savedColors.splice(index, 1);
        this.saveSavedColors();
        this.displaySavedColors();
        this.showFeedback('Color removed!');
    }

    clearAllColors() {
        if (this.savedColors.length > 0) {
            this.savedColors = [];
            this.saveSavedColors();
            this.displaySavedColors();
            this.showFeedback('All colors cleared!');
        }
    }

    loadSavedColors() {
        try {
            const saved = localStorage.getItem('colorPickerColors');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved colors:', error);
            return [];
        }
    }

    saveSavedColors() {
        try {
            localStorage.setItem('colorPickerColors', JSON.stringify(this.savedColors));
        } catch (error) {
            console.error('Error saving colors:', error);
        }
    }

    showFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPickerApp();
});