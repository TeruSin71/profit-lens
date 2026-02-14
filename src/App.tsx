import { ThemeProvider } from './components/ThemeProvider';
import { MainLayout } from './components/Layout/MainLayout';
import { ProductWizard } from './components/wizard/ProductWizard';

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <MainLayout>
                <ProductWizard />
            </MainLayout>
        </ThemeProvider>
    );
}

export default App;
