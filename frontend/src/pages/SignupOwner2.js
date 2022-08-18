import { React, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
// import { useRecoilState } from 'recoil';
import MainButton from '../components/common/Mainbutton';
// import { nicknameState } from '../state';
import { signOwnerData } from '../services/sign/signOwnerData';
import Header from '../components/Header';
import "../pages/SignupOwner.css";
import DaumPostcode from "react-daum-postcode";

const Formbox = styled.div`
    margin-bottom: 20px;
    .message {
        font-size: 11px;
        letter-spacing: -1px;
        margin: 0;
        &.success {
            color: #8f8c8b;
        }
        &.error {
            color: #ff2727;
        }
    }
`;

const SignupOwner2 = () => {
    // const [uNickname, setuNickname] = useRecoilState(nicknameState);
    const location = useLocation();
    const data = location.state.data; // SignOwner.js에서 Link로 보낸 데이터 받아오기

    const navigate = useNavigate();

    // 가게 이름, 사장님 성함, 가게 주소, 상세 주소, 연락처, 가게 인증
    const [storeName, setStoreName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [storeRoadAddress, setStoreRoadAddress] = useState(""); // 도로명주소
    const [storeDetailAddress, setStoreDetailAddress] = useState(""); // 상세주소
    const [phoneNumber, setPhoneNumber] = useState("");

    // 오류 메세지 상태 저장
    const [phoneNumberMessage, setPhoneNumberMessage] = useState("");

    // 유효성 검사
    const [isPhoneNumber, setIsPhoneNumber] = useState(false);

    // 가게 이름
    const onChangeStoreName = (e) => {
        setStoreName(e.target.value);
    }

    // 사장님 성함
    const onChangeOwnerName = (e) => {
        setOwnerName(e.target.value);
    }

    // 가게 주소
    const onChangeStoreRoadAddress = (e) => {
        setStoreRoadAddress(e.target.value);
    }

    const [isOpenPost, setIsOpenPost] = useState(false); // daum-postcode api를 팝업처럼 관리하기 위함

    const onChangeOpenPost = () => {
        setIsOpenPost(!isOpenPost);
    };
    
    const onCompletePost = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
    
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
    
        setStoreRoadAddress(fullAddress); // 도로명주소
        setIsOpenPost(false);
      };

    // 상세 주소
    const onChangeStoreDetailAddress = (e) => {
        setStoreDetailAddress(e.target.value);
    }

    // 연락처
    const onChangePhoneNumner = (e) => {
        const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
        setPhoneNumber(e.target.value);

        if (!phoneNumberRegex.test(e.target.value)) {
            setPhoneNumberMessage('연락처 형식을 다시 확인해주세요.');
            setIsPhoneNumber(false);
        } else {
            setPhoneNumberMessage('올바른 연락처 형식입니다.');
            setIsPhoneNumber(true);
        }
    }

    // 입력한 가게 인증번호
    const [certificationNumber, setCertificationNumber] = useState("");

    const onChangeCertificationNumber = (e) => {
        setCertificationNumber(e.target.value);
    };

    // 가게 인증번호 확인
    const [storeCheckMessage, setStoreCheckMessage] = useState("");
    const [isStoreCheck, setIsStoreCheck] = useState(false);

    // 인증 확인 눌러서 post 요청 보내면 일치할 경우 200, 이외의 경우에는 400을 응답
    const onEmailCheck = async () => {
        try {
            await axios
                .post("/auth/signup-code", {
                    "code": certificationNumber,
                })
                .then((res) => {
                    if (res.data.state === 200) {
                        // console.log(res.data.state);
                        setStoreCheckMessage('인증에 성공했습니다.');
                        setIsStoreCheck(true);
                    } else {
                        // console.log(res.data.state);
                        setStoreCheckMessage('잘못된 인증번호입니다.');
                        setIsStoreCheck(false);
                    }
                });
        } catch (e) {
            console.log(e);
        }
    };
    
    const onSubmit = async (e) => {
        e.preventDefault();

        const result = await signOwnerData({
            email: data.email,
            password: data.password,
            age: data.age,
            gender: data.gender,
            storeName: storeName,
            ownerName: ownerName,
            storeRoadAddress: storeRoadAddress,
            storeDetailAddress: storeDetailAddress,
            phoneNumber: phoneNumber,
        });

        // setuNickname(result); // recoil
        console.log(JSON.stringify(result));
        if (result.result === "fail") {
            alert(result.massage);
            navigate("/loginRegister"); // 로그인/회원가입 처음 페이지로 이동
        } else {
            alert(result.massage);
            navigate("/login"); // 로그인 공통 페이지로 이동
        }
        
    }

    return (
        <>
            <Header text="회원가입" link="/loginOwner"></Header>
            <div className="inputContainer">
                <Formbox>
                    <div className="intro">가게 이름</div>
                    <input className="inputBox"
                        name="storeName"
                        value={storeName}
                        type="text"
                        onChange={onChangeStoreName}
                        placeholder="가게 이름 입력"
                        required
                        autoComplete="off"
                        maxLength="20"
                    />
                </Formbox>
                <Formbox>
                    <div className="intro">사장님 성함</div>
                    <input className="inputBox"
                        name="ownerName"
                        value={ownerName}
                        type="text"
                        onChange={onChangeOwnerName}
                        placeholder="사장님 성함 입력"
                        required
                        autoComplete="off"
                        maxLength="16"
                    />
                </Formbox>
                <Formbox>
                    <div className="intro">가게 주소</div>
                    <input className="inputBox roadAddress"
                        name="storeRoadAddress"
                        value={storeRoadAddress}
                        type="text"
                        onChange={onChangeStoreRoadAddress}
                        placeholder="도로명 주소 검색"
                        required
                        autoComplete="off"
                    />
                    <button className="searchAddress" onClick={onChangeOpenPost}>주소 찾기</button>
                    {isOpenPost ? (<DaumPostcode className="daumPost" autoClose onComplete={onCompletePost} />) : null}
                    <div className="detailAddress">
                        <input className="inputBox"
                            name="storeDetailAddress"
                            value={storeDetailAddress}
                            type="text"
                            onChange={onChangeStoreDetailAddress}
                            placeholder="상세 주소 입력"
                            required
                            autoComplete="off"
                        />
                    </div>
                </Formbox>
                <Formbox>
                    <div className="intro">연락처</div>
                    <input className="inputBox"
                        name="phoneNumber"
                        value={phoneNumber}
                        type="text"
                        onChange={onChangePhoneNumner}
                        placeholder="010-xxxx-xxxx"
                        required
                        autoComplete="off"
                    />
                    {phoneNumber.length > 0 && <p className={`message ${isPhoneNumber ? 'success' : 'error'}`}>{phoneNumberMessage}</p>}
                </Formbox>
                <Formbox>
                    <div className="intro">가게 인증</div>
                    <div>
                        <input className="certificationInput storeCertification"
                            name="certificationNumber"
                            value={certificationNumber}
                            type="text"
                            onChange={onChangeCertificationNumber}
                            placeholder="가게 인증 코드 입력"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <MainButton
                        radius="5px"
                        color="#FFFFFF"
                        background="#386FFE;"
                        onClick={onEmailCheck}
                        disabled={(certificationNumber.length > 0 && !isStoreCheck) ? false : true}
                        text="인증 확인"
                    />
                    {certificationNumber.length > 0 && <p className={`message ${isStoreCheck ? 'success' : 'error'}`}>{storeCheckMessage}</p>}
                </Formbox>
            </div>
            <form onSubmit={onSubmit}>
                <div className="buttonContainer">
                    <MainButton
                        radius="15px"
                        color="#FFFFFF"
                        background="#386FFE;"
                        type="submit"
                        // disabled={(isPhoneNumber && isStoreCheck) ? false : true}
                        disabled={(isPhoneNumber) ? false : true}
                        text="회원가입"
                    />
                </div>
            </form>
        </>
    )
}

export default SignupOwner2;