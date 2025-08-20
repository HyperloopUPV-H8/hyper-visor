import styles from './Header.module.scss'
import logo from '../../assets/hyperloop_logo.svg'

export const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="Hyperloop UPV" className={styles.logo} />
            </div>
            <h1 className={styles.title}>Hyperloop UPV</h1>
        </div>
    )
}
