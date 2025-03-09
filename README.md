# Graphify  

**Graphify** is an interactive web application designed to educate users about graph algorithms through visualizations, quizzes, and a chatbot assistant. It provides an intuitive and engaging way to learn **Prim's, Kruskal's, and Dijkstra's algorithms**.  

## 🚀 Features  

- 🎥 **Interactive Visualizations**: Step-by-step animations for Prim's, Kruskal's, and Dijkstra's algorithms using `vis-network`.  
- 📝 **Quiz Mode**: Test your knowledge by selecting edges for MSTs or shortest paths with real-time feedback.  
- 🤖 **Chatbot Assistant**: Get instant answers to algorithm-related questions via `react-chatbot-kit`.  
- 📚 **Learn More Page**: Access detailed descriptions and pseudocode for each algorithm in an accordion layout.  
- 🔄 **Random Graph Generation**: Dynamically generate graphs for practice.  
- 🧭 **Seamless Navigation**: Responsive `Navbar` built with `react-bootstrap` for smooth routing.  

## 🛠️ Tech Stack  

**Frontend**: React.js  
**Libraries**:  
- `vis-network` - Graph visualization  
- `react-bootstrap` & `bootstrap` - UI components  
- `react-chatbot-kit` - Chatbot functionality  
- `heap-js` - Priority queue for Prim's algorithm  
- `react-router-dom` - Client-side routing  
- `react-icons` - Icons for chatbot button  
**Styling**: Custom CSS (`algorithm.css`, `ChatBot.css`, `LearnMore.css`, `styles.css`) + Bootstrap CSS  
**Deployment**: Compatible with GitHub Pages, Netlify, or Vercel.  

## 📂 Project Structure  

```plaintext
graphify/
├── src/                    # Source code directory
│   ├── Components/         # Reusable React components
│   │   ├── ChatbotComponent.js    # Chatbot with algorithm explanations
│   │   └── NavBar.js             # Navigation bar with dropdown
│   ├── Pages/             # Page components for different routes
│   │   ├── Dijktras.js           # Dijkstra's algorithm page
│   │   ├── Prims.js              # Prim's algorithm page
│   │   ├── Kruskals.js           # Kruskal's algorithm page
│   │   ├── LearnMore.js          # Educational content page
│   │   └── LandingPage.js        # (Assumed) Homepage
│   ├── styles/            # CSS stylesheets
│   │   ├── algorithm.css         # Graph visualization styles
│   │   ├── ChatBot.css           # Chatbot styles
│   │   ├── LearnMore.css         # Learn More page styles
│   │   └── styles.css            # General styles (e.g., Navbar)
│   └── Router.js          # Routing configuration
├── public/                # Public assets
│   ├── index.html                # HTML entry point
│   └── logo.png                  # (Placeholder) Graphify logo
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
