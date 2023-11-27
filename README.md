# MyhomeLogFront

## 개요


MyHome Project를 진행하던 도중 서비스에 대한 로깅 시스템의 필요성을 깨닫고 이를 웹으로 확인 할 수 있도록 모니터링 시스템을 구축하고자 한다.

## 구상


- 클라이언트
    - Web(JavaScript)
      - 로그 데이터를 Web을 통하여 직관적으로 확인 가능하도록 함.
      - 반응형으로 제작하여 모바일 또한 접근성 보장
      - 간략하게 한눈에 볼 수 있는 템플릿과 상세 정보 및 조건 검색까지 추가하여 손쉬운 로그 정보 확인을 유도 함.
      
    
- 서버 : 우분투
    - 기존에 구축한 Ubuntu 20.04 LTS 서버 유지
    - 백엔드 리팩토링 및 방화벽 재설정 등 보안성과 안정성 모두 크게 업그레이드 하고자 함
      - 백엔드 : SpringBoot을 통해 Kafka에서 발생한 메세지를 MongoDB에 저장. MongoDB의 데이터를 REST API를 통해 제공
      - 보안 : 허용된 계정으로만 로그인 이후 서비스 접근 가능. 로그인은 Security를 기반한 기존 서비스와 연동
    


## 개발 환경

- IntelliJ
- Visual Studio Code
- MobaXterm

## 사용 라이브러리

- Back-End(Spring Boot)
  - REST API
  - Kafka(Consumer)
- Server(DevOps)
    - Nginx
    - Kafka
    - MongoDB

## 사용 언어

- JAVA
- JavaScript


## 사용 프레임 워크

 - Spring Boot
 - NextJS

## CI/CD

 - GitHub
 - Jenkins
 - Docker
