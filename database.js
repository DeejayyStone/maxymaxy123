// Simulated Database using localStorage
class Database {
    constructor() {
        this.init();
    }

    init() {
        // Initialize database with sample data if empty
        if (!localStorage.getItem('csghana_posts')) {
            this.seedData();
        }
    }

    seedData() {
        // Sample opportunities
        const opportunities = [
            {
                id: 1,
                title: "Software Engineering Intern",
                company: "Hubtel",
                location: "Accra",
                type: "internship",
                deadline: "2024-06-30",
                description: "Join Ghana's leading payment solutions company",
                link: "#",
                icon: "fa-briefcase"
            },
            {
                id: 2,
                title: "Data Science Fellowship",
                company: "AMANDLA",
                location: "Remote",
                type: "fellowship",
                deadline: "2024-07-15",
                description: "6-month paid fellowship in data science",
                link: "#",
                icon: "fa-chart-line"
            },
            {
                id: 3,
                title: "Frontend Developer Intern",
                company: "DreamOval",
                location: "Accra",
                type: "internship",
                deadline: "2024-06-20",
                description: "Work on cutting-edge fintech solutions",
                link: "#",
                icon: "fa-code"
            }
        ];

        // Sample events
        const events = [
            {
                id: 1,
                title: "Ghana Tech Fest 2024",
                date: "2024-08-15",
                month: "AUG",
                day: "15",
                location: "Accra International Conference Centre",
                type: "Conference"
            },
            {
                id: 2,
                title: "Python Workshop for Beginners",
                date: "2024-07-22",
                month: "JUL",
                day: "22",
                location: "KNUST, Kumasi",
                type: "Workshop"
            },
            {
                id: 3,
                title: "Women in Tech Meetup",
                date: "2024-07-10",
                month: "JUL",
                day: "10",
                location: "iSpace, Accra",
                type: "Meetup"
            }
        ];

        // Sample blog posts
        const posts = [
            {
                id: 1,
                title: "How I got an internship at Hubtel",
                author: "Ama Mensah",
                authorImg: "https://randomuser.me/api/portraits/women/44.jpg",
                date: "2024-06-01",
                content: "My journey applying for tech internships in Ghana...",
                likes: 45,
                comments: 12
            },
            {
                id: 2,
                title: "Top 5 Programming Languages to learn in 2024",
                author: "Kwame Asante",
                authorImg: "https://randomuser.me/api/portraits/men/32.jpg",
                date: "2024-05-28",
                content: "Based on the Ghanaian job market analysis...",
                likes: 78,
                comments: 23
            }
        ];

        // Sample resources
        const resources = [
            {
                id: 1,
                title: "FreeCodeCamp",
                category: "learning",
                description: "Interactive coding lessons",
                dataUsage: "50MB/hour",
                link: "https://freecodecamp.org"
            },
            {
                id: 2,
                title: "MTN Foundation Scholarship",
                category: "scholarship",
                description: "For STEM students in Ghanaian universities",
                deadline: "2024-08-30",
                link: "#"
            }
        ];

        localStorage.setItem('csghana_opportunities', JSON.stringify(opportunities));
        localStorage.setItem('csghana_events', JSON.stringify(events));
        localStorage.setItem('csghana_posts', JSON.stringify(posts));
        localStorage.setItem('csghana_resources', JSON.stringify(resources));
    }

    // Get all opportunities
    getOpportunities() {
        return JSON.parse(localStorage.getItem('csghana_opportunities')) || [];
    }

    // Get all events
    getEvents() {
        return JSON.parse(localStorage.getItem('csghana_events')) || [];
    }

    // Get all posts
    getPosts() {
        return JSON.parse(localStorage.getItem('csghana_posts')) || [];
    }

    // Get resources by category
    getResourcesByCategory(category) {
        const allResources = JSON.parse(localStorage.getItem('csghana_resources')) || [];
        if (category === 'all') return allResources;
        return allResources.filter(r => r.category === category);
    }

    // Add new post
    addPost(post) {
        const posts = this.getPosts();
        post.id = posts.length + 1;
        post.date = new Date().toISOString().split('T')[0];
        post.likes = 0;
        post.comments = 0;
        posts.push(post);
        localStorage.setItem('csghana_posts', JSON.stringify(posts));
        return post;
    }

    // Like a post
    likePost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            localStorage.setItem('csghana_posts', JSON.stringify(posts));
        }
        return post;
    }

    // Subscribe to newsletter
    subscribeNewsletter(email) {
        let subscribers = JSON.parse(localStorage.getItem('csghana_subscribers')) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('csghana_subscribers', JSON.stringify(subscribers));
            return { success: true, message: 'Subscribed successfully!' };
        }
        return { success: false, message: 'Email already subscribed!' };
    }

    // Get upcoming events
    getUpcomingEvents(limit = 3) {
        const events = this.getEvents();
        const today = new Date();
        return events
            .filter(e => new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);
    }

    // Get featured opportunities
    getFeaturedOpportunities(limit = 3) {
        const opportunities = this.getOpportunities();
        return opportunities.slice(0, limit);
    }
}

// Initialize database
const db = new Database();