import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "./BoardListView.css";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
const BoardListView = () => {
  const navigate = useNavigate();
  //좋아요 유무를 확인하기 위한 변수
  const [isFavorited, setIsfavorited] = useState(false);
  //작성자 확인을 위한 변수
  const [authority, setAuthority] = useState(false);
  //서버로부터 받아오는 게시물 데이터를 위한 변수
  const [data, setData] = useState();
  //게시글 id
  const { articleId } = useParams();
  //삭제 팝업 확인을 위한 변수
  const [isDeletePopUpOpend, setIsDeletePopUpOpend] = useState(false);

  const getBoardData = async () => {
    axios.get(`/board/list/${articleId}`).then((response) => {
      console.log(response.data);
      setData(response.data);
      setIsfavorited(response.data.favorite);
      setAuthority(response.data.authority);
    });
  };

  useEffect(() => {
    getBoardData();
  }, []);

  //찜 버튼 클릭 함수
  const onLikeClick = async () => {
    await axios
      .post(`/member/favorite/add?storeId=${data.storeId}`)
      .then((res) => {
        setIsfavorited(!isFavorited);
        console.log("찜 성공");
      });
  };

  //수정 버튼 클릭 함수
  const modifyHandler = () => {};

  //삭제 버튼 클릭시 팝업 토글 함수
  const togglePopUp = () => {
    setIsDeletePopUpOpend(!isDeletePopUpOpend);
  };

  //게시글 삭제 함수
  const deleteHandler = async () => {
    await axios.post(`/board/delete/${articleId}`).then((res) => {
      alert("삭제되었습니다.");
    });
    //팝업 닫기
    setIsDeletePopUpOpend(!isDeletePopUpOpend);
    //뒤로 이동
    navigate(-1);
  };

  //아직 데이터가 들어오기 전이면 로딩 중 출력
  if (!data) {
    return <h1>로딩 중...</h1>;
  } else {
    return (
      <>
        <Header text={"제휴 맺기 게시판"} back={true}></Header>
        <div className="viewContainer">
          <img
            className="viewImg"
            alt="img"
            src={`data:image/jpg;base64, ${data.images[0]}`}
          ></img>
          <div className="viewContentBox">
            <div className="viewContentHeader">
              <span className="author">{data.author}</span>
              <span className="location">어쩌구 저쩌구</span>
            </div>
            <div className="viewContentMiddle">
              <div className="viewContentTop">
                <span className="title">{data.title}</span>
                <span className="writeDate">{data.createDate}</span>
              </div>

              <span className="content">{data.content}</span>
            </div>
            <div className="viewContentFooter">
              <div className="likeContainer">
                {isFavorited ? (
                  <button className="UnLikeBtn" onClick={onLikeClick}>
                    <FcLike size={"1.8em"}></FcLike>
                  </button>
                ) : (
                  <button className="LikeBtn" onClick={onLikeClick}>
                    <FcLikePlaceholder size={"1.8em"}></FcLikePlaceholder>
                  </button>
                )}
              </div>
              <div className="periodContainer">
                <span className="label">제휴 기간</span>
                <span className="period">{data.period}</span>
              </div>
              <button className="chatBtn">채팅하기</button>
            </div>
            {authority ? (
              <div className="btnBox">
                <button className="modifyBtn" onClick={modifyHandler}>
                  수정
                </button>
                <button className="deleteBtn" onClick={togglePopUp}>
                  삭제
                </button>
              </div>
            ) : null}
          </div>
          {authority && isDeletePopUpOpend ? (
            <div className="deletePopUp">
              <span>삭제하시겠습니까?</span>
              <div className="popUpBtnBox">
                <button className="popUpCancleBtn" onClick={togglePopUp}>
                  취소
                </button>
                <button className="popUpDeleteBtn" onClick={deleteHandler}>
                  삭제
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }
};

export default BoardListView;