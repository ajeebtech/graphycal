import Link from 'next/link';
import styles from '../app/page.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navLogo}>
                <span>PVP</span>
                <span>VALORANT</span>
            </div>
            <div className={styles.navLinks}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/data" className={styles.navLink}>Data</Link>
            </div>
        </nav>
    );
}
