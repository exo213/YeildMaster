# YieldMaster PRO

**YieldMaster PRO** is a professional-grade semiconductor yield simulation and analysis tool. It provides engineers and fab managers with interactive tools to model, visualize, and optimize wafer yield based on industry-standard statistical models.

## Key Features

### 📊 Advanced Yield Modeling
Simulate yield using three standard defect models:
- **Poisson Model**: Best for random defect distributions.
- **Murphy Model**: Accounts for varying defect densities across the wafer.
- **Negative Binomial (NB) Model**: Ideal for clustering effects (using the $\alpha$ parameter).

### 🧮 Interactive Simulator
Real-time calculation of critical metrics:
- **Yield Rate**: Percentage of functional dies.
- **Gross Dies**: Total dies per wafer based on diameter (e.g., 300mm) and die area.
- **Good Dies**: Estimated functional dies.
- **Wafer Efficiency**: Ratio of total die area to wafer area.

### 🧪 Strategic Analysis
- **Defect Density (D0)**: Adjustable defect density parameter ($/cm^2$).
- **Cluster Factor ($\alpha$)**: Tune clustering severity for the Negative Binomial model.
- **Die Area & Wafer Size**: Configurable physical parameters to simulate different product lines.

## Tech Stack
- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Visualization**: HTML5 Canvas / Custom Components
- **Icons**: Lucide React

## Getting Started

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development
Start the local development server:
```bash
npm run dev
```

### Build for Production
Create an optimized build for deployment:
```bash
npm run build
```

## Deployment
This project is optimized for deployment on **Vercel**.
1.  Import the repository.
2.  Vercel will auto-detect the Vite framework.
3.  Deploy.

