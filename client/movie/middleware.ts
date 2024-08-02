import { NextRequest, NextResponse } from "next/server";

// 공개된 URL 목록을 정의합니다.
interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/profile": true,
  "/posts": true,
  "/posts/:id": true,
  "/posts/create": true,
  "/posts/edit/:id": true,
};

// 토큰을 검증하는 헬퍼 함수
const verifyToken = (token: string | undefined): boolean => {
  if (!token) return false;

  // 예제 로직: 토큰의 유효성을 확인합니다.
  try {
    // 실제 토큰 검증 로직으로 대체해야 합니다.
    // 예: jwt.verify(token, secret)
    return true; // 토큰이 유효한 경우 true를 반환
  } catch (error) {
    return false; // 토큰이 유효하지 않은 경우 false를 반환
  }
};

// 경로 매칭을 위한 헬퍼 함수
const matchPublicRoute = (pathname: string): boolean => {
  // 정규 표현식을 사용하여 동적 경로를 매칭
  for (const route of Object.keys(publicOnlyUrls)) {
    const pattern = route.replace(/:[^\s/]+/g, "[^/]+"); // ":id" 같은 동적 경로를 매칭하기 위한 패턴
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return publicOnlyUrls[route]; // 공개된 경로로 매칭되면 true 반환
    }
  }
  return false; // 매칭되지 않으면 false 반환
};

export async function middleware(request: NextRequest) {
  // 요청 헤더에서 토큰을 가져옵니다.
  const token = request.headers.get("Authorization")?.split(" ")[1];

  // 요청된 URL이 공개된 URL 목록에 있는지 확인합니다.
  const isPublicRoute = matchPublicRoute(request.nextUrl.pathname);

  // 토큰의 유효성을 확인합니다.
  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    // 토큰이 유효하지 않은 경우, 공개된 URL이 아니면 로그인 페이지로 리디렉션합니다.
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // 토큰이 유효한 경우, 공개된 URL이면 홈 페이지로 리디렉션합니다.
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // 다음 미들웨어 또는 요청 처리로 이동합니다.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|_next/image|favicon.ico).*)"],
};