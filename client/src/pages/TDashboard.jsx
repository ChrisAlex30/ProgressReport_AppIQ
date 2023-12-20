import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"
import Navbar from '../components/Navbar'
import TeacherModal from '../components/TeacherModal';

const TDashboard = () => {
  const navigate = useNavigate();

  const tref=useRef()


  useEffect(()=>{
    const token = Cookies.get('uid')    
    if (!token) {
        navigate('/')
        alert('plz login')            
     }
  },[])
  const [testMarks,setTestMarks]=useState({
    id:"",
    T1:"",
    T2:"",
    T3:"",
    month:""
  })
  const handlemarksChange=(e)=>{
    setTestMarks({...testMarks,[e.target.name]:e.target.value})
  }

  
  const handleView=(stu)=>{
    const { T1,T2,T3, month } = stu.month[0]
    setTestMarks({
      id:stu.id,
      T1,
      T2,
      T3,
      month
    })
    tref.current.showModal()
  }

  const [students,setStudents]= useState([])


  const [filter,setFilter]=useState({
    classname:'',
    monthname:''
  })

  const{monthname,classname}=filter

  const handleChange=(e)=>{
    setFilter({...filter,[e.target.name]:e.target.value})
  }

  const reset=()=>{
    setFilter({
      classname:'',
      monthname:''
    })
    setStudents([])
  }

  
  const search=async()=>{
    const token = Cookies.get('uid')    
    if (token) {
      if(!monthname || !classname){   
        alert('Plz Fill all Fields!!!')
        return
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/studentdetails/${monthname}/${classname}`, {
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

  return (
    <>
    <Navbar role="admin"/>
    <TeacherModal tref={tref} testMarks={testMarks} handlemarksChange={handlemarksChange} search={search}/>
    <div className='bckg'>
    <div className="admin-form-heading">
        <span >WELCOME TEACHER</span>
        </div>
        <div className='service-section'>
        <div className='service-form'>
                    
                <span className='form-lbl'>Class</span>
                <select id="class" name="classname" className='inp-dd' value={classname} onChange={handleChange} >
                <option value="0">--Select Class--</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                </select>
                <span className='form-lbl'>Month</span>
                <select id="class" name="monthname" className='inp-dd' value={monthname} onChange={handleChange} >
                <option value="0">--Select Month</option>
                <option value="january">JAN</option>
                <option value="febuary">FEB</option>
                <option value="march">MAR</option>
                <option value="april">APR</option>
                <option value="may">MAY</option>
                <option value="june">JUN</option>
                <option value="july">JUL</option>
                <option value="august">AUG</option>
                <option value="september">SEP</option>
                <option value="october">OCT</option>
                <option value="november">NOV</option>
                <option value="december">DEC</option>
                </select>

                
            <div >
                <button className="btn" onClick={search}>SEARCH</button>
                <button className="btn" onClick={reset} >RESET</button>
            </div>
                    </div> 
        <div className='service-table'>
        <table className="tab" >
            <thead >
                <tr>
            <th>Name</th>
            <th>Action</th>
            </tr>
            </thead>
            <tbody className="screen">
              {
                students.length===0?
                <tr>
                  <td colSpan={5}>NO DATA YET!!!</td>
                </tr>
                :
                students.map((student)=><tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                    <button onClick={()=>handleView(student)} className='tbl-btn' >View</button>
                    </td>
                </tr>)
              }
                
            </tbody>
      </table>
        </div>
      
        </div>
       
        </div>
    </>
  )
}

export default TDashboard