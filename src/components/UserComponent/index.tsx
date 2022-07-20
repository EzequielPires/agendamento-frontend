import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "src/context/AuthContext";
import styles from "./styles.module.scss";

export function UserComponent() {
    const {user, signOut}  = useAuth();
    if(!user) {
        return null;
    }
    return (
        <div className={styles.user}>
            <div className={styles.avatar}>
                {user.avatar ? 
                    <img src={`http://localhost:3000/${user.avatar}`} alt="" />
                :
                <span>{user ? user.name?.substring(0, 1) : ''}</span>
                }
            </div>
            <div className='d-flex flex-column'>
                <h5 className={styles.user_name}>{user.name ?? ''}</h5>
                <span className={styles.user_role}>{user.role}</span>
            </div>
            <button className={styles.signout} onClick={signOut}>
                <FaSignOutAlt />
            </button>
        </div>
    )
}