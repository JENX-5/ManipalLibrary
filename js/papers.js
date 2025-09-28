// Papers page functionality
class PapersManager {
    constructor() {
        this.papersGrid = document.getElementById('papersGrid');
        this.noResults = document.getElementById('noResults');
        this.filterBranch = document.getElementById('filterBranch');
        this.filterSemester = document.getElementById('filterSemester');
        this.filterSubject = document.getElementById('filterSubject');
        this.filterYear = document.getElementById('filterYear');
        
        this.allPapers = [];
        this.filteredPapers = [];
        
        this.init();
    }

    async init() {
        await this.loadPapers();
        this.setupEventListeners();
        this.createFilterCounter();
    }

    async loadPapers() {
        try {
            // Show loading state
            this.papersGrid.innerHTML = '<div class="loading">Loading papers...</div>';
            
            const response = await fetch('papers.json');
            if (!response.ok) {
                throw new Error('Failed to load papers');
            }
            
            this.allPapers = await response.json();
            this.filteredPapers = [...this.allPapers];
            
            this.populateFilters();
            this.displayPapers();
            
        } catch (error) {
            console.error('Error loading papers:', error);
            this.papersGrid.innerHTML = '<div class="loading error">Error loading papers. Please try again later.</div>';
        }
    }

    populateFilters() {
        const branches = new Set();
        const semesters = new Set();
        const subjects = new Set();
        const years = new Set();

        this.allPapers.forEach(paper => {
            // Handle comma-separated values
            paper.branch.split(',').forEach(b => branches.add(b.trim()));
            paper.semester.split(',').forEach(s => semesters.add(s.trim()));
            paper.subject.split(',').forEach(sub => subjects.add(sub.trim()));
            years.add(paper.year);
        });

        // Populate branch filter
        Array.from(branches).sort().forEach(branch => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = branch;
            this.filterBranch.appendChild(option);
        });

        // Populate semester filter (numeric sort)
        Array.from(semesters).sort((a, b) => parseInt(a) - parseInt(b)).forEach(semester => {
            const option = document.createElement('option');
            option.value = semester;
            option.textContent = `Semester ${semester}`;
            this.filterSemester.appendChild(option);
        });

        // Populate subject filter
        Array.from(subjects).sort().forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            this.filterSubject.appendChild(option);
        });

        // Populate year filter (descending order)
        Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            this.filterYear.appendChild(option);
        });
    }

    displayPapers() {
        if (this.filteredPapers.length === 0) {
            this.papersGrid.style.display = 'none';
            this.noResults.style.display = 'block';
            this.updateFilterCounter(0);
            return;
        }

        this.papersGrid.style.display = 'grid';
        this.noResults.style.display = 'none';
        
        this.papersGrid.innerHTML = '';
        
        this.filteredPapers.forEach((paper, index) => {
            const card = this.createPaperCard(paper, index);
            this.papersGrid.appendChild(card);
        });

        this.updateFilterCounter(this.filteredPapers.length);
        
        // Refresh animations for new cards
        if (window.scrollAnimator) {
            setTimeout(() => window.scrollAnimator.refresh(), 100);
        }
    }

    createPaperCard(paper, index) {
        const card = document.createElement('div');
        card.className = 'paper-card';
        card.setAttribute('data-animate', 'zoom-in');
        card.setAttribute('data-delay', Math.min(index * 100, 400));
        
        // Store filter data for potential future use
        card.dataset.branch = paper.branch;
        card.dataset.semester = paper.semester;
        card.dataset.subject = paper.subject;
        card.dataset.year = paper.year;

        // Fix: Use 'link' property instead of 'file'
        const downloadLink = paper.link || paper.file || '#';
        
        card.innerHTML = `
            <div>
                <h4>${this.escapeHtml(paper.title)}</h4>
                <div class="paper-meta">
                    <span><strong>Branch:</strong> ${this.escapeHtml(paper.branch)}</span>
                    <span><strong>Semester:</strong> ${paper.semester}</span>
                    <span><strong>Subject:</strong> ${this.escapeHtml(paper.subject)}</span>
                    <span><strong>Year:</strong> ${paper.year}</span>
                </div>
            </div>
            <a href="${downloadLink}" target="_blank" rel="noopener noreferrer" class="download-btn">
                Download PDF
            </a>
        `;

        return card;
    }

    filterPapers() {
        const branch = this.filterBranch.value.toLowerCase().trim();
        const semester = this.filterSemester.value.trim();
        const subject = this.filterSubject.value.toLowerCase().trim();
        const year = this.filterYear.value.trim();

        this.filteredPapers = this.allPapers.filter(paper => {
            const paperBranches = paper.branch.toLowerCase().split(',').map(b => b.trim());
            const paperSemesters = paper.semester.split(',').map(s => s.trim());
            const paperSubjects = paper.subject.toLowerCase().split(',').map(s => s.trim());
            const paperYear = paper.year.toString();

            const branchMatch = !branch || paperBranches.some(b => b.includes(branch));
            const semesterMatch = !semester || paperSemesters.includes(semester);
            const subjectMatch = !subject || paperSubjects.some(s => s.includes(subject));
            const yearMatch = !year || paperYear === year;

            return branchMatch && semesterMatch && subjectMatch && yearMatch;
        });

        this.displayPapers();
    }

    setupEventListeners() {
        this.filterBranch.addEventListener('change', () => this.filterPapers());
        this.filterSemester.addEventListener('change', () => this.filterPapers());
        this.filterSubject.addEventListener('change', () => this.filterPapers());
        this.filterYear.addEventListener('change', () => this.filterPapers());

        // Add search functionality
        this.addSearchFunctionality();
    }

    addSearchFunctionality() {
        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="paperSearch" placeholder="Search papers..." class="search-input">
        `;
        
        const filtersSection = document.querySelector('.filters-section');
        filtersSection.insertBefore(searchContainer, filtersSection.firstChild);

        const searchInput = document.getElementById('paperSearch');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchPapers(e.target.value);
            }, 300);
        });
    }

    searchPapers(query) {
        if (!query.trim()) {
            this.filteredPapers = [...this.allPapers];
            this.displayPapers();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        this.filteredPapers = this.allPapers.filter(paper => {
            return paper.title.toLowerCase().includes(searchTerm) ||
                   paper.branch.toLowerCase().includes(searchTerm) ||
                   paper.subject.toLowerCase().includes(searchTerm) ||
                   paper.year.includes(searchTerm);
        });

        this.displayPapers();
    }

    createFilterCounter() {
        const counter = document.createElement('div');
        counter.className = 'filter-counter';
        counter.id = 'filterCounter';
        counter.innerHTML = `Showing <strong>${this.allPapers.length}</strong> papers`;
        
        const papersContainer = document.querySelector('.papers-grid-container');
        papersContainer.insertBefore(counter, this.papersGrid);
    }

    updateFilterCounter(count) {
        const counter = document.getElementById('filterCounter');
        if (counter) {
            counter.innerHTML = `Showing <strong>${count}</strong> of <strong>${this.allPapers.length}</strong> papers`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize papers manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.papersManager = new PapersManager();
});