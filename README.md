
Built by https://www.blackbox.ai

---

# La Gestiona

La Gestiona is a web-based application designed for managing dossiers, allowing users to add, modify, delete, and track the status of their dossiers in an elegant and user-friendly interface.

## Project Overview

The application is built with HTML, CSS, and JavaScript, utilizing the Tailwind CSS framework for styling and Font Awesome for icons. It aims to streamline dossier management tasks, offering functionalities such as adding new dossiers, listing existing ones, modifying, and deleting them, along with tracking their statuses.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
   
2. Navigate into the project folder:
   ```bash
   cd La-Gestiona
   ```

3. Open the `index.html` file in a web browser:
   ```bash
   open index.html  # For macOS
   # OR
   start index.html # For Windows
   ```

## Usage

1. **Adding a Dossier**: Select the "Ajouter" tab, fill out the required information, and click "Ajouter" to save it.
2. **View Dossiers**: Navigate to the "Liste des dossiers" section to view all added dossiers.
3. **Modifying a Dossier**: Select the "Modifier" tab to view and modify an existing dossier.
4. **Deleting a Dossier**: Go to the "Supprimer" tab to remove undesired dossiers.
5. **Tracking Statuses**: Use the "État" tab to check treated dossiers, missing pieces, and total writings.

## Features

- **User-Friendly Interface**: Built using Tailwind CSS for a responsive layout.
- **Dossier Management**: Add, view, modify, and delete dossiers seamlessly.
- **Status Tracking**: Easily track statuses of dossiers including 'In Progress', 'Pending', and 'Completed'.
- **Local Storage**: All information is stored in the browser's local storage for persistence.

## Dependencies

The project relies on the following libraries:

- [Tailwind CSS](https://tailwindcss.com/): CSS framework for utility-first styling.
- [Font Awesome](https://fontawesome.com/): Library for vector icons and social logos.

There are no additional dependencies listed in the `package.json` file, as this project does not involve Node.js.

## Project Structure

The project structure is organized as follows:

```
La-Gestiona/
│
├── index.html           # Main HTML file for the application interface.
├── js/
│   ├── script.js        # JavaScript file that contains the core functionality.
│   ├── La_Gestiona_script.js # Additional script files related to functionalities.
│   ├── La_Gestiona_final.js   # Final version for deployment.
│   ├── La_Gestiona_script_part1.js # Code for initial part of the script.
│   ├── La_Gestiona_script_part2.js # Code for functions related to lists and states.
└── styles/              # (Optional) Any custom CSS files (if needed in the future).
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve functionality and usability. 

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Special thanks to the creators of Tailwind CSS and Font Awesome for their amazing tools that facilitate web development.