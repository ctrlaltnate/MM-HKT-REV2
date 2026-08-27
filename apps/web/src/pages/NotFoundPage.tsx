import { AnimatedPage } from "../components/AnimatedPage";
import { EmptyState, PixelLink } from "../components/PixelUI";

export function NotFoundPage() {
  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">404 Error</span>
        <h1>ไม่พบเส้นทางนี้</h1>
        <p>หน้าที่คุณพยายามเข้าถึงอาจถูกย้าย ลบ หรือยังไม่ถูกสร้าง</p>
      </div>
      <EmptyState
        title="404 · Page Not Found"
        body="กรุณากลับสู่หน้าหลักเพื่อสำรวจงานแฟร์หรือเข้าสู่ระบบ"
        action={<PixelLink to="/" tone="mango">กลับหน้าแรก</PixelLink>}
      />
    </AnimatedPage>
  );
}
