import styles from '../page.module.css';
import Navbar from '../../components/Navbar';

export default function DataPage() {
    return (
        <main className={styles.page}>
            <Navbar />
            <div style={{
                maxWidth: '600px',
                textAlign: 'center',
                marginTop: '10vh',
                color: '#ff8c00', // Dark Orange
                fontFamily: 'var(--font-unbounded), monospace',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                lineHeight: '1.4',
                padding: '2rem',
                border: '2px solid #ff8c00',
                boxShadow: '10px 10px 0px #ff8c00',
                backgroundColor: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <p>
                    The data is scraped from <a href="https://vlr.gg" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>vlr.gg</a> and <a href="https://bo3.gg" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>bo3.gg</a>.
                </p>
                <div style={{ margin: '1.5rem 0', height: '2px', background: '#ff8c00', opacity: 0.5 }}></div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 140, 0, 0.8)' }}>
                    Data refreshes every 24 hours.
                </p>
                <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>
                    There is no intention to monetize this — it's just a tool.
                </p>
            </div>
        </main>
    );
}
