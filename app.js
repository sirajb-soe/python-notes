// Python Unit-I Interactive Learning Platform
class PythonLearningApp {
    constructor() {
        this.currentSection = 'python-concepts';
        this.progress = {
            'python-concepts': false,
            'control-statements': false,
            'functions': false,
            'modules': false
        };
        this.quizzes = {
            'python-concepts': {
                questions: [
                    {
                        question: "Which is a valid Python identifier?",
                        options: ["1value", "user_name", "my-var", "class"],
                        correct: 1
                    },
                    {
                        question: "Which operator performs exponentiation in Python?",
                        options: ["*", "**", "//", "%"],
                        correct: 1
                    }
                ],
                currentQuestion: 0,
                score: 0,
                completed: false
            },
            'control-statements': {
                questions: [
                    {
                        question: "Which statement stops a loop completely?",
                        options: ["continue", "break", "pass", "elif"],
                        correct: 1
                    }
                ],
                currentQuestion: 0,
                score: 0,
                completed: false
            },
            'functions': {
                questions: [
                    {
                        question: "What keyword defines a function in Python?",
                        options: ["func", "def", "lambda", "return"],
                        correct: 1
                    }
                ],
                currentQuestion: 0,
                score: 0,
                completed: false
            },
            'modules': {
                questions: [
                    {
                        question: "Which keyword is used to import a module?",
                        options: ["include", "import", "require", "use"],
                        correct: 1
                    }
                ],
                currentQuestion: 0,
                score: 0,
                completed: false
            }
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCodeEditors();
        this.setupQuizzes();
        this.setupMobileMenu();
        this.showSection('python-concepts'); // Show content immediately
        this.updateProgress();
        
        // Initialize CodeMirror for all code editors
        this.initializeCodeMirror();
        
        console.log('Python Learning App initialized');
    }

    setupNavigation() {
        // Desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
                this.updateActiveNavLink(link);
                
                // Close mobile menu if open
                const mobileNav = document.querySelector('.nav-mobile');
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            });
        });

        // Set initial active nav link
        const activeLink = document.querySelector('.nav-link[href="#python-concepts"]');
        if (activeLink) {
            this.updateActiveNavLink(activeLink);
        }
    }

    updateActiveNavLink(activeLink) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        activeLink.classList.add('active');
        
        // Also update mobile nav if applicable
        const href = activeLink.getAttribute('href');
        const mobileLink = document.querySelector(`.nav-mobile .nav-link[href="${href}"]`);
        if (mobileLink) {
            mobileLink.classList.add('active');
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionId;
            
            // Smooth scroll to top of section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    setupCodeEditors() {
        const runButtons = document.querySelectorAll('.run-btn');
        runButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const container = button.closest('.code-editor-container');
                const editor = container.querySelector('.code-editor');
                const output = container.parentElement.querySelector('.code-output .output-content');
                
                if (editor && output) {
                    this.runCode(editor.value, output);
                }
            });
        });
    }

    initializeCodeMirror() {
        const codeEditors = document.querySelectorAll('.code-editor');
        codeEditors.forEach((editor, index) => {
            // Skip if CodeMirror is already initialized
            if (editor.nextSibling && editor.nextSibling.classList && editor.nextSibling.classList.contains('CodeMirror')) {
                return;
            }

            try {
                const codeMirror = CodeMirror.fromTextArea(editor, {
                    mode: 'python',
                    theme: 'material',
                    lineNumbers: true,
                    indentUnit: 4,
                    indentWithTabs: false,
                    lineWrapping: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                });

                // Set initial content and auto-run for demonstration
                setTimeout(() => {
                    if (index === 0) {
                        // Auto-run the first example to show immediate content
                        const output = editor.closest('.code-example').querySelector('.output-content');
                        if (output) {
                            this.runCode(codeMirror.getValue(), output);
                        }
                    }
                }, 500);
                
                // Store reference for later use
                editor.codeMirror = codeMirror;
            } catch (error) {
                console.log('CodeMirror not available, using plain textarea');
            }
        });
    }

    runCode(code, outputElement) {
        if (!outputElement) return;
        
        // Simulate Python code execution with predefined outputs
        const outputs = {
            // Python Concepts examples
            'print("Hello, World!")': 'Hello, World!',
            'print("Hello, World!")\nprint("Welcome to Python programming!")': 'Hello, World!\nWelcome to Python programming!',
            'name = "Alice"\nage = 25': 'Name: Alice\nAge: 25\nHeight: 5.6\nStudent: True\nName: Alice, Age: 25, Height: 5.6\nName: Alice, Age: 25, Height: 5.6',
            
            // Default outputs for common patterns
            default: this.generatePythonOutput(code)
        };

        let output = outputs[code] || outputs.default;
        
        // Add typing effect
        outputElement.innerHTML = '';
        this.typeWriter(outputElement, output, 0);
    }

    generatePythonOutput(code) {
        // Simple Python code simulation
        const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        let output = [];
        
        for (const line of lines) {
            if (line.includes('print(')) {
                // Extract print content
                const match = line.match(/print\((.*?)\)/);
                if (match) {
                    let content = match[1];
                    // Handle f-strings and variables
                    if (content.includes('f"') || content.includes("f'")) {
                        content = this.processFString(content);
                    }
                    // Remove quotes
                    content = content.replace(/^["']|["']$/g, '');
                    output.push(content);
                }
            }
        }
        
        return output.length > 0 ? output.join('\n') : 'Code executed successfully!';
    }

    processFString(fstring) {
        // Simple f-string processing
        const patterns = {
            '{name}': 'Alice',
            '{age}': '25',
            '{height}': '5.6',
            '{is_student}': 'True',
            '{number}': '7',
            '{temp}': '25',
            '{username}': 'admin',
            '{i}': '1',
            '{letter}': 'P',
            '{fruit}': 'apple',
            '{num}': '2'
        };
        
        let processed = fstring;
        for (const [pattern, value] of Object.entries(patterns)) {
            processed = processed.replace(pattern, value);
        }
        
        return processed;
    }

    typeWriter(element, text, index) {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            setTimeout(() => this.typeWriter(element, text, index + 1), 20);
        }
    }

    setupQuizzes() {
        const quizSections = document.querySelectorAll('.quiz');
        quizSections.forEach(quiz => {
            const sectionName = quiz.dataset.section;
            if (this.quizzes[sectionName]) {
                this.initializeQuiz(quiz, sectionName);
            }
        });
    }

    initializeQuiz(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        
        // Setup option click handlers
        const options = quizElement.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                this.selectAnswer(quizElement, sectionName, index);
            });
        });

        // Setup navigation
        const nextBtn = quizElement.querySelector('.next-question');
        const prevBtn = quizElement.querySelector('.prev-question');
        const restartBtn = quizElement.querySelector('.restart-quiz');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestion(quizElement, sectionName);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevQuestion(quizElement, sectionName);
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartQuiz(quizElement, sectionName);
            });
        }

        // Initialize first question
        this.showQuestion(quizElement, sectionName, 0);
    }

    selectAnswer(quizElement, sectionName, selectedIndex) {
        const quiz = this.quizzes[sectionName];
        const currentQ = quiz.questions[quiz.currentQuestion];
        const options = quizElement.querySelectorAll('.option');
        const feedback = quizElement.querySelector('.feedback');

        // Clear previous selections
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'wrong');
        });

        // Mark selection
        options[selectedIndex].classList.add('selected');

        // Show correct/wrong after a delay
        setTimeout(() => {
            options[currentQ.correct].classList.add('correct');
            if (selectedIndex !== currentQ.correct) {
                options[selectedIndex].classList.add('wrong');
                feedback.innerHTML = `❌ Incorrect. The correct answer is: ${currentQ.options[currentQ.correct]}`;
            } else {
                quiz.score++;
                feedback.innerHTML = `✅ Correct! Well done.`;
            }
            feedback.classList.add('show');
        }, 500);

        // Enable next button
        const nextBtn = quizElement.querySelector('.next-question');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    showQuestion(quizElement, sectionName, questionIndex) {
        const quiz = this.quizzes[sectionName];
        const questions = quizElement.querySelectorAll('.question');
        
        // Hide all questions
        questions.forEach(q => q.classList.remove('active'));
        
        // Show current question
        if (questions[questionIndex]) {
            questions[questionIndex].classList.add('active');
            quiz.currentQuestion = questionIndex;
        }

        // Update navigation
        this.updateQuizNavigation(quizElement, sectionName);
    }

    updateQuizNavigation(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        const prevBtn = quizElement.querySelector('.prev-question');
        const nextBtn = quizElement.querySelector('.next-question');
        const counter = quizElement.querySelector('.question-counter');

        if (prevBtn) {
            prevBtn.disabled = quiz.currentQuestion === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = true; // Will be enabled when answer is selected
            if (quiz.currentQuestion === quiz.questions.length - 1) {
                nextBtn.textContent = 'Finish';
            } else {
                nextBtn.textContent = 'Next';
            }
        }

        if (counter) {
            counter.textContent = `${quiz.currentQuestion + 1} of ${quiz.questions.length}`;
        }
    }

    nextQuestion(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        
        if (quiz.currentQuestion < quiz.questions.length - 1) {
            this.showQuestion(quizElement, sectionName, quiz.currentQuestion + 1);
        } else {
            this.finishQuiz(quizElement, sectionName);
        }

        // Hide feedback
        const feedback = quizElement.querySelector('.feedback');
        if (feedback) {
            feedback.classList.remove('show');
        }
    }

    prevQuestion(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        
        if (quiz.currentQuestion > 0) {
            this.showQuestion(quizElement, sectionName, quiz.currentQuestion - 1);
        }

        // Hide feedback
        const feedback = quizElement.querySelector('.feedback');
        if (feedback) {
            feedback.classList.remove('show');
        }
    }

    finishQuiz(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        quiz.completed = true;
        
        // Hide questions and navigation
        quizElement.querySelectorAll('.question').forEach(q => q.style.display = 'none');
        quizElement.querySelector('.quiz-navigation').style.display = 'none';
        
        // Show results
        const results = quizElement.querySelector('.quiz-results');
        const score = results.querySelector('.score');
        
        const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
        score.innerHTML = `🎉 Quiz Complete!<br>Score: ${quiz.score}/${quiz.questions.length} (${percentage}%)`;
        
        if (percentage >= 70) {
            score.innerHTML += '<br><span style="color: var(--success-green)">Great job! 🌟</span>';
            this.progress[sectionName] = true;
        } else {
            score.innerHTML += '<br><span style="color: var(--warning-orange)">Try again to improve! 💪</span>';
        }
        
        results.classList.add('show');
        this.updateProgress();
    }

    restartQuiz(quizElement, sectionName) {
        const quiz = this.quizzes[sectionName];
        
        // Reset quiz data
        quiz.currentQuestion = 0;
        quiz.score = 0;
        quiz.completed = false;
        
        // Reset UI
        quizElement.querySelectorAll('.question').forEach(q => {
            q.style.display = '';
            q.classList.remove('active');
        });
        
        quizElement.querySelector('.quiz-navigation').style.display = '';
        quizElement.querySelector('.quiz-results').classList.remove('show');
        
        // Clear all selections and feedback
        quizElement.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected', 'correct', 'wrong');
        });
        
        quizElement.querySelectorAll('.feedback').forEach(feedback => {
            feedback.classList.remove('show');
        });
        
        // Show first question
        this.showQuestion(quizElement, sectionName, 0);
    }

    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.nav-mobile');
        
        if (menuBtn && mobileNav) {
            menuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                
                // Update button icon
                const icon = menuBtn.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }

    updateProgress() {
        const completedSections = Object.values(this.progress).filter(completed => completed).length;
        const totalSections = Object.keys(this.progress).length;
        const percentage = Math.round((completedSections / totalSections) * 100);
        
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}% Complete`;
        }
    }

    // Utility method to mark section as completed
    completeSection(sectionId) {
        this.progress[sectionId] = true;
        this.updateProgress();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show Python Concepts section immediately
    document.querySelectorAll('.content-section').forEach(section => {
        if (section.id === 'python-concepts') {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Initialize the app
    window.pythonApp = new PythonLearningApp();
    
    // Add some interactive demonstrations
    setTimeout(() => {
        // Auto-run first code example to show immediate interactivity
        const firstRunBtn = document.querySelector('.run-btn');
        if (firstRunBtn) {
            firstRunBtn.click();
        }
    }, 1000);
});

// Add smooth scrolling behavior
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const mobileNav = document.querySelector('.nav-mobile');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            if (menuBtn) {
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Performance optimization: Lazy load content
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all topic cards for animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.topic-card').forEach(card => {
            observer.observe(card);
        });
    }, 500);
});