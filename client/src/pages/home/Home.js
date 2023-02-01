import { Link, useNavigate } from "react-router-dom";
import style from "./Home.module.css";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const userrole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const user=localStorage.getItem('firstName')+' '+localStorage.getItem('lastName')
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, userrole]);
  return (
    <>
      <Navbar title={user}/>
      <div className={style.homeBody}>
        {userrole === "SUPER_ADMIN" && 
          <Link to="/users" className={style.btn}>
          Users
          </Link>
        }
         {userrole==="USER" && 
          <Link to={`/users/${userId}`} className={style.btn}>
             Shaxsiy ma'lumotlarni o'zgartirish
          </Link> 
        }
         {userrole === "USER" && 
           <Link to={`/users/change-password/${userId}`} className={style.btn}>
            Parolni o'zgartirish
          </Link>    
        } 
       
      </div>
    </>
  );
};
export default Home;
