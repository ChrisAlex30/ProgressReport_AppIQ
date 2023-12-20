import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"

const ViewDeleted = () => {
    const navigate = useNavigate();

    const [students,setStudents]= useState([])
    const [SIds,setSIds]= useState([])
    const SIdsAdd=(e)=>{
        if(e.target.checked){
            setSIds([...SIds,e.target.value])
        }
        else{
            setSIds(SIds.filter(val => val !== e.target.value))
        }

    }

    const getData=async()=>{
        const token = Cookies.get('uid')    
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/getdeletedstudents`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "authorization":token
            },
          });
          const data= await response.json()
          if(data.msg === "NOT AUTHORIZED"){
            alert('PLz Login!!!')
            navigate("/")
          }   
          else
          setStudents(data)
        }
        else{
          alert('PLz Login!!!')
          navigate("/")
        }
      }

    useEffect(()=>{
        const token = Cookies.get('uid')    
        if (!token) {
            navigate('/')
            alert('plz login')            
         }
         else{
          getData()
         }
    },[])

    const revert=async(e)=>{
        const token = Cookies.get('uid')    
        if (token) {
            if(students.length===0){   
                alert('No students to revert!!!')
                return
              }
            if(SIds.length===0){   
                alert('Plz select some students!!!')
                return
              }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/revertdeletedstudents`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization":token
            },
            body:JSON.stringify({SIds})
            });
            const data= await response.json()
            if(data.msg === "NOT AUTHORIZED"){
              alert('PLz Login!!!')
              navigate("/")
            }      
            else{
                alert(data.msg) 
                getData()
                setSIds([])
            }  
            
        }
        else{
            alert('PLz Login!!!')
            navigate("/")
          }
    }

  return (
    <>
    <Navbar role="admin"/>
    <div className='bckg'>
    <div className="admin-form-heading">
        <span >WELCOME ADMIN</span>
        </div>
        <div className='service-section'>
        <div className='service-table'>
        <table className="tab" >
            <thead >
                <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Join Date</th>
            <th>Select</th>
            </tr>
            </thead>
            <tbody className="screen">
              {
                students.length===0?
                <tr>
                  <td colSpan={5}>NO DATA YET!!!</td>
                </tr>
                :
                students.map((student)=><tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.classname}</td>
                    <td>{new Date(student.DOJ).toLocaleString().split(',')[0].replaceAll('/','-')}</td>
                    <td>
                    <input type="checkbox" value={student._id} onChange={(e)=>{SIdsAdd(e)}} checked={SIds.includes(student._id)} />
                    </td>
                </tr>)
              }
                
            </tbody>
      </table>
        </div>
      
        </div>
        <div style={{
            textAlign:"center",
            marginTop:"20px"
        }}> 
        <button className="btn btn-log" onClick={revert} >REVERT DELETED</button>
        <button className="btn btn-log" onClick={()=>{setSIds([])}} >RESET</button>
        <button className="btn btn-log" onClick={()=>{navigate('/admin')}} >BACK</button>
        </div>
        </div>
    </>
  )
}

export default ViewDeleted