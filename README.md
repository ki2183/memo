# memo

블록형 텍스트 에디터를 이용한 메모 사이트입니다.

이 사이트는 사용자가 블록 기반의 텍스트 에디터를 통해 메모를 작성하고, 계정에 로그인하여 메모를 저장하고 관리할 수 있는 기능을 제공합니다. 작성된 메모는 언제든지 수정하거나 삭제할 수 있으며, 텍스트 블록 간의 이동, 병합, 분할 등의 편집 기능을 제공합니다.

## 프로젝트 진행 이유

> 첫 프로젝트에서 리뷰 기능을 구현하기 위해, 사용자가 손쉽게 메모를 작성하고 관리할 수 있는 텍스트 에디터를 개발하고자 했습니다. 벨로그와 노션 같은 직관적인 UI를 구현하는 것을 목표로 했으나 당시에는 기술적 한계가 있었습니다. 이후 이를 보완하여, 텍스트 블록의 동적인 생성과 편집이 가능한 에디터를 완성했습니다.


| **기술 스택**     | **선택 이유** |
| ----------------- | ------------- |
| TailWindCSS       | CSS IN JS로 동적인 스타일링이 가능하며 빠른 유지보수가 가능하여 채택 |
| Vercel            | 백엔드 서버와 분리하고 Github를 통한 빠르고 간단한 CI/CD를 제공하여 빠른 유지보수가 가능하여 채택 |
| Axios             | 내장 라이브러리의 다양성과 axios interceptor/instance 사용으로 관리 및 유지보수의 용이성에 따라 선택함. |
| react-query       | 페이지네이션에 사용하는 동기적으로 실행되는 API들의 개선과 prefetch를 사용하기 위해 도입 |
| Redux             | 과도한 드릴링을 개선하기 위해서 도입 |
| Typescript        | 런타임 에러를 컴파일 시점에 잡아낼 수 있어 안정적인 코드 운용이 가능함. 명확한 타입 정보를 제공하여 가독성이 좋기에 프로젝트 규모의 크기를 불문하고 유지보수가 용이하여 도입 |

## 주요 구현 기능

### **회원가입**

회원가입 기능을 통해 계정을 생성하고 메모를 저장할 수 있습니다.

![회원가입](https://drive.google.com/uc?export=view&id=1y_5Mms3HJAl8yvDIa6soRLxugH71uQ-Z)

### **로그인**

로그인 후 개인 계정에 메모를 저장하고 관리할 수 있습니다.

![로그인](https://drive.google.com/uc?export=view&id=1T2zAzUlDTUSBHRgEx-6IB7shUOu5K6hW)

### **텍스트 에디터**

#### 글 쓰기

- Enter 키로 새로운 블록을 추가하고, Backspace로 블록을 삭제할 수 있습니다.
  ![추가삭제](https://drive.google.com/uc?export=view&id=1n_PYWHRDCVvGk5iZVGd-T_9j3YYcLTQu)

- 방향키를 이용해 블록 간 이동이 가능합니다.
  ![이동](https://drive.google.com/uc?export=view&id=1ECYFB1PP2TP1DNoNk01VI_COVqKM6u4E)
  
- 텍스트 사이에서 Enter를 누를 때 블록이 분할되고, 텍스트 맨 앞에서 Backspace를 누르면 이전 블록과 내용이 합쳐집니다.
  ![분할](https://drive.google.com/uc?export=view&id=1hDnkVHIkwxNxunv4LN-ns4p1j5pfjb_6)

#### 이미지 추가, 정렬 및 크기 조절

- 간단하게 이미지를 이미지 주소를 입력하여 구현할 수 있습니다.
- 이미지 끝에 있는 옵션 버튼을 통해 정렬, 크기 조절 및 삭제가 가능합니다.
  ![이미지 추가](https://drive.google.com/uc?export=view&id=1S-xI1T1IhVFFjUO7ySMlaHbNiCBoWyjV)

#### 이미지 드래그 앤 드랍

- React-DND를 도입하여 이미지의 위치를 드래그 앤 드랍으로 변경할 수 있습니다. 이미지 위로 드랍하면 드랍한 이미지와 자리가 바뀌고, 텍스트 블록에 드랍하면 해당 텍스트 블록 아래 이미지가 추가됩니다.
  ![dnd](https://drive.google.com/uc?export=view&id=1bmRsw4GllNptVQPxyYOOfT9pbvYtTz4_)

### **메모 목록**
- 메모 목록에서 작성한 메모를 확인하고 관리할 수 있습니다.
  ![목록](https://drive.google.com/uc?export=view&id=1vMb96UR7fCwpM31DuRQJIUBa_QdcHWAx)
