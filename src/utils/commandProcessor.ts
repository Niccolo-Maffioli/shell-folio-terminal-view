
import { TerminalLine } from '../components/Terminal';

export class CommandProcessor {
  private fileSystem = {
    '~': {
      type: 'directory',
      children: ['about.txt', 'skills.json', 'projects/', 'experience/', 'contact.txt']
    },
    '~/projects': {
      type: 'directory',
      children: ['e-commerce-app/', 'task-manager/', 'weather-dashboard/', 'portfolio-site/']
    },
    '~/experience': {
      type: 'directory',
      children: ['senior-dev.txt', 'fullstack-dev.txt', 'frontend-dev.txt']
    }
  };

  getWelcomeMessage(): string[] {
    return [
      '',
      '██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ ',
      '██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗',
      '██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║',
      '██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║',
      '██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝',
      '╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ ',
      '',
      '┌─ Full Stack Developer Portfolio Terminal ─┐',
      '│                                           │',
      '│  Welcome to my interactive portfolio!     │',
      '│  Type "help" to see available commands    │',
      '│  Navigate like a real terminal            │',
      '│                                           │',
      '└───────────────────────────────────────────┘',
      '',
      '🚀 System initialized. Ready for commands...',
      ''
    ];
  }

  processCommand(command: string, currentPath: string): {
    output: string[];
    type: 'output' | 'error' | 'system';
    newPath?: string;
  } {
    const [cmd, ...args] = command.trim().split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        return this.handleHelp();
      
      case 'about':
        return this.handleAbout();
      
      case 'skills':
        return this.handleSkills();
      
      case 'projects':
        return this.handleProjects();
      
      case 'experience':
        return this.handleExperience();
      
      case 'education':
        return this.handleEducation();
      
      case 'contact':
        return this.handleContact();
      
      case 'ls':
        return this.handleLs(currentPath, args[0]);
      
      case 'cd':
        return this.handleCd(currentPath, args[0]);
      
      case 'pwd':
        return { output: [currentPath], type: 'output' };
      
      case 'whoami':
        return { output: ['Full Stack Developer'], type: 'output' };
      
      case 'date':
        return { output: [new Date().toString()], type: 'output' };
      
      case 'clear':
        return { output: ['\x1b[2J\x1b[H'], type: 'system' };
      
      case 'cat':
        return this.handleCat(args[0]);
      
      case 'tree':
        return this.handleTree();
      
      default:
        return {
          output: [`Command not found: ${cmd}. Type 'help' for available commands.`],
          type: 'error'
        };
    }
  }

  private handleHelp(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '📚 Available Commands:',
        '',
        '┌─ Portfolio Commands ─────────────────────────┐',
        '│  about      - Learn about me                │',
        '│  skills     - View my technical skills      │',
        '│  projects   - See my latest projects        │',
        '│  experience - Check my work experience      │',
        '│  education  - View my educational background│',
        '│  contact    - Get my contact information    │',
        '└──────────────────────────────────────────────┘',
        '',
        '┌─ Terminal Commands ──────────────────────────┐',
        '│  ls         - List files and directories    │',
        '│  cd         - Change directory              │',
        '│  cat        - Display file contents         │',
        '│  pwd        - Show current directory        │',
        '│  whoami     - Display user information      │',
        '│  date       - Show current date/time        │',
        '│  tree       - Display directory tree        │',
        '│  clear      - Clear terminal screen         │',
        '│  help       - Show this help message        │',
        '└──────────────────────────────────────────────┘',
        '',
        '💡 Tip: Use Tab for auto-completion and ↑/↓ for command history',
        ''
      ],
      type: 'system'
    };
  }

  private handleAbout(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '👋 About Me',
        '═══════════',
        '',
        'I\'m a passionate Full Stack Developer with 5+ years of experience',
        'building scalable web applications and solving complex problems.',
        '',
        '🎯 Specializations:',
        '  • Frontend: React, TypeScript, Next.js, Vue.js',
        '  • Backend: Node.js, Python, PostgreSQL, MongoDB',
        '  • Cloud: AWS, Docker, Kubernetes',
        '  • DevOps: CI/CD, Infrastructure as Code',
        '',
        '🌟 What drives me:',
        '  • Creating exceptional user experiences',
        '  • Writing clean, maintainable code',
        '  • Continuous learning and innovation',
        '  • Mentoring junior developers',
        '',
        '📍 Currently based in San Francisco, CA',
        '🌐 Open to remote opportunities worldwide',
        ''
      ],
      type: 'output'
    };
  }

  private handleSkills(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '💻 Technical Skills',
        '═══════════════════',
        '',
        '🔥 Frontend Development:',
        '  ▓▓▓▓▓ React.js/Next.js     (Expert)',
        '  ▓▓▓▓▓ TypeScript/JavaScript (Expert)',
        '  ▓▓▓▓▓ HTML5/CSS3/SCSS      (Expert)',
        '  ▓▓▓▓░ Vue.js/Nuxt.js       (Advanced)',
        '  ▓▓▓▓░ Tailwind CSS         (Advanced)',
        '',
        '⚙️ Backend Development:',
        '  ▓▓▓▓▓ Node.js/Express      (Expert)',
        '  ▓▓▓▓░ Python/Django/Flask  (Advanced)',
        '  ▓▓▓▓░ PHP/Laravel          (Advanced)',
        '  ▓▓▓▓▓ RESTful APIs         (Expert)',
        '  ▓▓▓▓░ GraphQL              (Advanced)',
        '',
        '🗄️ Databases:',
        '  ▓▓▓▓▓ PostgreSQL/MySQL     (Expert)',
        '  ▓▓▓▓░ MongoDB              (Advanced)',
        '  ▓▓▓▓░ Redis                (Advanced)',
        '  ▓▓▓░░ DynamoDB             (Intermediate)',
        '',
        '☁️ Cloud & DevOps:',
        '  ▓▓▓▓░ AWS/EC2/S3/Lambda    (Advanced)',
        '  ▓▓▓▓░ Docker/Kubernetes    (Advanced)',
        '  ▓▓▓▓░ CI/CD Pipelines      (Advanced)',
        '  ▓▓▓░░ Terraform            (Intermediate)',
        '',
        '🛠️ Tools & Others:',
        '  ▓▓▓▓▓ Git/GitHub           (Expert)',
        '  ▓▓▓▓▓ VS Code/WebStorm     (Expert)',
        '  ▓▓▓▓░ Jest/Cypress         (Advanced)',
        '  ▓▓▓▓░ Webpack/Vite         (Advanced)',
        ''
      ],
      type: 'output'
    };
  }

  private handleProjects(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '🚀 Featured Projects',
        '═══════════════════',
        '',
        '1. 🛒 E-Commerce Platform',
        '   ├─ Tech Stack: React, Node.js, PostgreSQL, AWS',
        '   ├─ Features: Real-time inventory, payment processing, admin dashboard',
        '   ├─ Scale: 10K+ daily users, 99.9% uptime',
        '   └─ GitHub: github.com/yourname/ecommerce-platform',
        '',
        '2. 📊 Analytics Dashboard',
        '   ├─ Tech Stack: Next.js, TypeScript, D3.js, Python API',
        '   ├─ Features: Real-time data visualization, custom reports',
        '   ├─ Impact: Reduced reporting time by 80%',
        '   └─ GitHub: github.com/yourname/analytics-dashboard',
        '',
        '3. 🤖 AI Chat Application',
        '   ├─ Tech Stack: Vue.js, Node.js, Socket.io, OpenAI API',
        '   ├─ Features: Real-time messaging, AI responses, file sharing',
        '   ├─ Users: 5K+ registered users',
        '   └─ GitHub: github.com/yourname/ai-chat-app',
        '',
        '4. 🏗️ Project Management Tool',
        '   ├─ Tech Stack: React, Django, PostgreSQL, Docker',
        '   ├─ Features: Task tracking, team collaboration, time tracking',
        '   ├─ Adoption: Used by 3 companies, 100+ projects',
        '   └─ GitHub: github.com/yourname/project-management',
        '',
        '💡 View more projects: "cd ~/projects" then "ls"',
        ''
      ],
      type: 'output'
    };
  }

  private handleExperience(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '💼 Professional Experience',
        '═════════════════════════',
        '',
        '🏢 Senior Full Stack Developer | TechCorp Inc.',
        '   📅 2022 - Present | San Francisco, CA',
        '   ┌─ Responsibilities:',
        '   ├─ Led development of microservices architecture',
        '   ├─ Mentored team of 4 junior developers',
        '   ├─ Implemented CI/CD pipelines reducing deployment time by 60%',
        '   └─ Built scalable APIs serving 1M+ requests daily',
        '',
        '🏢 Full Stack Developer | StartupXYZ',
        '   📅 2020 - 2022 | Remote',
        '   ┌─ Achievements:',
        '   ├─ Developed MVP that secured $2M in Series A funding',
        '   ├─ Built real-time collaboration features using WebSockets',
        '   ├─ Optimized database queries improving performance by 40%',
        '   └─ Established testing practices achieving 90% code coverage',
        '',
        '🏢 Frontend Developer | DigitalAgency',
        '   📅 2019 - 2020 | New York, NY',
        '   ┌─ Projects:',
        '   ├─ Created responsive websites for 20+ clients',
        '   ├─ Implemented modern design systems and component libraries',
        '   ├─ Improved site performance and SEO rankings',
        '   └─ Collaborated with UX/UI designers and stakeholders',
        '',
        '📈 Career Progression: Frontend → Full Stack → Senior → Tech Lead',
        ''
      ],
      type: 'output'
    };
  }

  private handleEducation(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '🎓 Education & Certifications',
        '═══════════════════════════',
        '',
        '🏫 Bachelor of Science in Computer Science',
        '   📍 University of California, Berkeley',
        '   📅 2015 - 2019 | GPA: 3.8/4.0',
        '   🏆 Summa Cum Laude, Dean\'s List (6 semesters)',
        '',
        '📜 Professional Certifications:',
        '   ✅ AWS Certified Solutions Architect (2023)',
        '   ✅ MongoDB Certified Developer (2022)',
        '   ✅ Google Cloud Professional Developer (2022)',
        '   ✅ Certified Kubernetes Administrator (2021)',
        '',
        '📚 Continuous Learning:',
        '   • Advanced React Patterns & Performance',
        '   • System Design & Architecture',
        '   • Machine Learning Fundamentals',
        '   • Blockchain Development',
        '',
        '🏆 Achievements:',
        '   • Hackathon Winner - TechCrunch Disrupt 2021',
        '   • Open Source Contributor (50+ repositories)',
        '   • Technical Blog Writer (10K+ monthly readers)',
        '   • Conference Speaker - ReactConf 2023',
        ''
      ],
      type: 'output'
    };
  }

  private handleContact(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '📞 Contact Information',
        '════════════════════',
        '',
        '📧 Email:     john.doe@email.com',
        '📱 Phone:     +1 (555) 123-4567',
        '🌐 Website:   https://johndoe.dev',
        '📍 Location:  San Francisco, CA',
        '',
        '🔗 Professional Links:',
        '   💼 LinkedIn:  linkedin.com/in/johndoe-dev',
        '   💻 GitHub:    github.com/johndoe-dev',
        '   🐦 Twitter:   @johndoe_dev',
        '   📰 Blog:      blog.johndoe.dev',
        '',
        '💬 Let\'s Connect!',
        '   I\'m always open to discussing new opportunities,',
        '   collaborating on interesting projects, or just',
        '   having a chat about technology and development.',
        '',
        '🕐 Availability: Open for new opportunities',
        '💰 Rate: $80-120/hour (freelance)',
        '⏰ Timezone: PST (UTC-8)',
        ''
      ],
      type: 'output'
    };
  }

  private handleLs(currentPath: string, arg?: string): { output: string[]; type: 'output' | 'error' | 'system' } {
    const path = arg ? `${currentPath}/${arg}`.replace('//', '/') : currentPath;
    const normalizedPath = path === '/' ? '~' : path;
    
    if (this.fileSystem[normalizedPath]) {
      const items = this.fileSystem[normalizedPath].children;
      const output = [''];
      
      items.forEach(item => {
        if (item.endsWith('/')) {
          output.push(`drwxr-xr-x  2 user user  4096 ${new Date().toDateString().slice(4)} ${item}`);
        } else {
          output.push(`-rw-r--r--  1 user user  1024 ${new Date().toDateString().slice(4)} ${item}`);
        }
      });
      
      output.push('');
      return { output, type: 'output' };
    }
    
    return {
      output: [`ls: cannot access '${arg || currentPath}': No such file or directory`],
      type: 'error'
    };
  }

  private handleCd(currentPath: string, arg?: string): { output: string[]; type: 'output' | 'error' | 'system'; newPath?: string } {
    if (!arg) {
      return { output: [''], type: 'output', newPath: '~' };
    }

    if (arg === '..') {
      const parts = currentPath.split('/');
      parts.pop();
      const newPath = parts.length === 1 ? '~' : parts.join('/');
      return { output: [''], type: 'output', newPath };
    }

    const newPath = currentPath === '~' ? `~/${arg}` : `${currentPath}/${arg}`;
    
    if (this.fileSystem[newPath]) {
      return { output: [''], type: 'output', newPath };
    }

    return {
      output: [`cd: no such file or directory: ${arg}`],
      type: 'error'
    };
  }

  private handleCat(filename?: string): { output: string[]; type: 'output' | 'error' | 'system' } {
    if (!filename) {
      return { output: ['cat: missing file operand'], type: 'error' };
    }

    const files: { [key: string]: string[] } = {
      'about.txt': [
        'Full Stack Developer with 5+ years of experience',
        'Passionate about creating scalable web applications',
        'Expert in React, Node.js, and cloud technologies'
      ],
      'contact.txt': [
        'Email: john.doe@email.com',
        'LinkedIn: linkedin.com/in/johndoe-dev',
        'GitHub: github.com/johndoe-dev'
      ]
    };

    if (files[filename]) {
      return { output: ['', ...files[filename], ''], type: 'output' };
    }

    return {
      output: [`cat: ${filename}: No such file or directory`],
      type: 'error'
    };
  }

  private handleTree(): { output: string[]; type: 'output' | 'error' | 'system' } {
    return {
      output: [
        '',
        '📁 Portfolio Directory Structure',
        '',
        '~/',
        '├── about.txt',
        '├── skills.json',
        '├── contact.txt',
        '├── projects/',
        '│   ├── e-commerce-app/',
        '│   ├── task-manager/',
        '│   ├── weather-dashboard/',
        '│   └── portfolio-site/',
        '└── experience/',
        '    ├── senior-dev.txt',
        '    ├── fullstack-dev.txt',
        '    └── frontend-dev.txt',
        ''
      ],
      type: 'output'
    };
  }
}
