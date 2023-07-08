import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { SecurityKeyContext } from "../contexts/securityKey"
import styles from './SecurityKeyAlertOverlay.module.css'

interface Props {
    children: any
}

const SecurityAlertOverlay = ({ children }: Props) => {
    let verificationResult: SecurityKeyVerificationContext | null = useContext(SecurityKeyContext)
    if (window.location.hash === '') {
        verificationResult = null
    }

    return (
        <>
            <AnimatePresence>
                { verificationResult && verificationResult.status !== 'verified'
                    ?
                    <motion.div
                        className={styles['security-key-overlay']}
                        initial={{ opacity: 1, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1.0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, type: 'spring' }}
                    >
                        <div className={styles["alert-content"]}>
                            <div className={styles['alert-info']}>
                                <div className={styles['alert-icon-positioner']}>
                                    <ExclamationTriangleIcon className={styles['alert-icon']}/>
                                </div>
                                <h1> Plug In Your Security Key </h1>
                                <p className={styles["alert-security-key-desc"]}>
                                    Your security key is the only ensurence that keep your data being accessed by anyone else.
                                    Never lose it or give it to some one you do not trust.
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam aliquam, elit sed hendrerit tempus, libero justo pretium urna, et ornare nisl ex at enim. Proin ut accumsan nisi. Nulla congue feugiat tellus eu feugiat. Nullam pellentesque ipsum et enim cursus, quis accumsan ex egestas. Donec pretium ornare nunc, id tincidunt magna rhoncus nec. Nunc accumsan massa non eros molestie, eget rhoncus odio egestas. Phasellus finibus sem a enim ultricies, id auctor diam accumsan.
                                </p>
                            </div>
                            <div className={styles['button-group']}>
                                <button
                                    className={styles['log-out-btn']}
                                    onClick={ () => window.api.navToLoginPage() }
                                >
                                    Log me out
                                </button>
                                <button
                                    className={styles['lost-security-key-btn']}
                                    onClick={() => alert('you are doomed')}
                                >
                                    I lost my security key
                                </button>
                            </div>
                        </div>

                    </motion.div>
                    :
                    null
                }
            </AnimatePresence>
            { children }
        </>
    )
}

export default SecurityAlertOverlay
