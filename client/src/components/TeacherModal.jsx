import React from 'react'
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"

const TeacherModal = ({tref,testMarks,handlemarksChange,search}) => {
    const navigate = useNavigate();

    const { id,T1,T2,T3, month } = testMarks

    const closeView=()=>{
        tref.current.close()
      }
      const update=async()=>{
        const token = Cookies.get('uid')    
        if (token) {
            if(!id || !month){
                alert("Please select the required fields. !!!!")
                return
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/updatestudentdata/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "authorization":token
              },
              body:JSON.stringify({T1,T2,T3, month})
            });
            const data= await response.json()
            if(data.msg === "NOT AUTHORIZED"){
              alert('PLz Login!!!')
              navigate("/")
            }   
            else{
                alert(data.msg) 
                search()
                tref.current.close()
            } 
          }
          else{
            alert('PLz Login!!!')
            navigate("/")
          }
        
        
      }  
       
  return (
    <dialog ref={tref}>
         <div className="admin-form-heading">
        <span >STUDENT MARKS</span>
        </div>
        <div className='modal-form'>
                 <span className='modal-lbl'>T1</span>
                <input type="text" name="T1" placeholder="Enter Marks" value={T1} onChange={handlemarksChange} className='inp' />
                <span className='modal-lbl'>T2</span>
                <input type="text" name="T2" placeholder="Enter Marks" value={T2} onChange={handlemarksChange} className='inp' />
                <span className='modal-lbl'>T3</span>
                <input type="text" name="T3" placeholder="Enter Marks" value={T3} onChange={handlemarksChange} className='inp' />
        </div>

        <div style={{
            textAlign:"center",
            marginTop:"40px"
        }}> 
        <button className="btn " onClick={update}>UPDATE</button>
        <button className="btn " onClick={closeView}>CLOSE</button>
        </div>

        
    </dialog>
  )
}

export default TeacherModal