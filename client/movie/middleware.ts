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
};

// 토큰을 검증하는 헬퍼 함수
const verifyToken = (token: string | undefined): boolean => {
  // 실제 토큰 검증 로직으로 대체해야 합니다.
  if (!token) return false;

  // 예제 로직: 토큰의 유효성을 확인합니다.
  try {
    // 예를 들어 jwt.verify(token, secret) 등을 사용하여 토큰을 디코드하고 검증할 수 있습니다.
    return true;
  } catch (error) {
    return false;
  }
};

export async function middleware(request: NextRequest) {
  // 요청 헤더에서 토큰을 가져옵니다.
  const token = request.headers.get("Authorization")?.split(" ")[1];

  // 요청된 URL이 공개된 URL 목록에 있는지 확인합니다.
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  // 토큰의 유효성을 확인합니다.
  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    // 토큰이 유효하지 않은 경우, 공개된 URL이 아니면 로그인 페이지로 리디렉션합니다.
    if (!exists) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // 토큰이 유효한 경우, 공개된 URL이면 홈 페이지로 리디렉션합니다.
    if (exists) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // 다음 미들웨어 또는 요청 처리로 이동합니다.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|_next/image|favicon.ico).*)"],
};
