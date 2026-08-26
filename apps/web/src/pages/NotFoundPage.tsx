import { AnimatedPage } from "../components/AnimatedPage";
import { EmptyState, PixelLink } from "../components/PixelUI";

export function NotFoundPage() {
  return (
    <AnimatedPage className="page-shell">
      <EmptyState
        title="404 · ไม่พบเส้นทางนี้"
        body="ลิงก์อาจเปลี่ยนหรือหน้านี้ยังไม่ถูกสร้าง"
        action={<PixelLink to="/" tone="mango">กลับหน้าแรก</PixelLink>}
      />
    </AnimatedPage>
  );
}
