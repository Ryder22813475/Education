import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null); // 初始設置為 null
  const [courseData, setCourseData] = useState(null);
  const [courseEnrollId, setCourseEnrollId] = useState("");
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  // 查找所有課程
  useEffect(() => {
    const handleAll = () => {
      CourseService.getCourseAll()
        .then((data) => {
          setCourseData(data.data);
          setSearchResult(data.data); // 初始設置為所有課程
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const handleElse = () => {
      CourseService.getEnrolledCourses(currentUser.user._id)
        .then((data) => {
          const datas = data.data
          const ids = datas.map(course => course._id);
          setCourseEnrollId(ids); // 初始設置為所有已註冊課程
          console.log(ids);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    handleElse();
    handleAll();
  }, []);


  const handleChangeInput = (e) => {
      handleSearch(e.target.value); 
  };

  const handleSearch = (input) => {
    if (!input.trim()) {
      setSearchResult(courseData); // 如果搜索條件為空，顯示所有課程
    } else {
      const filteredCourses = courseData.filter(course =>
        course.title.includes(input)
      );
      setSearchResult(filteredCourses);
    }
  };

  const handleEnroll = (e) => {
    console.log(e.target.id)
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功!! 重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const cancelEnroll = (e) => {
    console.log(e.target.id)
    CourseService.cancelEnroll(e.target.id)
      .then(() => {
        window.alert("課程取消註冊成功！");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
    {!currentUser && (
      <div>
        <p>您必須先登入才能開始註冊課程。</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleTakeToLogin}
        >
          回到登入頁面
        </button>
      </div>
    )}

    {currentUser && currentUser.user.role == "instructor" && (
      <div>
        <h1>只有學生才能夠註冊課程</h1>
      </div>
    )}

    {currentUser && currentUser.user.role == "student" && (
      <div className="search input-group mb-3">
        <input
          type="text"
          className="form-control"
          onChange={handleChangeInput}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          搜尋課程
        </button>
      </div>
    )}

    {currentUser && currentUser.user.role == "student" && searchResult && searchResult.length !== 0 && (
      <div>
        <p>相關課程資訊如下</p>
        <div style={{ display: "flex",flexWrap:"wrap" }}>
          {searchResult.map((course) => {
            return (
              <div
                key={course._id}
                className={`card ${courseEnrollId.includes(course._id) ? 'enrolled' : ''}`}
                style={{ width: "20rem", margin: "1rem",alignItems:"center" }}
              >
                <div className="card-body">
                  <img src={course.base64String} style={{ margin: "0.5rem 0rem" ,width:"100%", maxHeight:"300px"}} alt={course.title} />
                  <h5 className="card-title">
                      課程名稱 <br />
                      {course.title}
                    </h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師: {course.instructor.username}
                  </p>
                  <div style={{ textAlign:"center" }}>
                  {!courseEnrollId.includes(course._id) && (
                    <a
                      href="#"
                      id={course._id}
                      className="btn btn-primary card-text"
                      onClick={handleEnroll}
                      style={{backgroundColor:" #4CAF50"}}
                    >
                      註冊課程
                    </a>
                  )}
                  {courseEnrollId.includes(course._id) && (
                    <a
                      href="#"
                      id={course._id}
                      className="btn btn-primary card-text"
                      onClick={cancelEnroll}
                      style={{backgroundColor:"#FFC107"}}
                    >
                      取消註冊
                    </a>
                  )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
    </div>
  );
};

export default EnrollComponent;

