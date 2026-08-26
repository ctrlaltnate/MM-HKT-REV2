export function ProfileAvatar({ seed, size = 44 }: { seed: string; size?: number }) {
  const code = [...seed].reduce((total, character) => total + character.charCodeAt(0), 0);
  const hair = code % 2 === 0 ? "#9a72ff" : "#78dbe6";
  const shirt = code % 3 === 0 ? "#ffd84d" : "#9a72ff";
  return (
    <svg className="profile-avatar" width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="อวตารโปรไฟล์แบบพิกเซล" shapeRendering="crispEdges">
      <path fill="#07101a" d="M4 4h40v40H4z" />
      <path fill={hair} d="M14 10h20v4h4v12H10V14h4z" />
      <path fill="#d7a27f" d="M14 18h20v14H14z" />
      <path fill="#07101a" d="M18 22h4v4h-4zm8 0h4v4h-4z" />
      <path fill={shirt} d="M10 34h28v10H10z" />
      <path fill="#78dbe6" d="M20 30h8v6h-8z" />
    </svg>
  );
}
