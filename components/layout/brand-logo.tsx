type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <img src="/figma/nic-pouch-logo.jpg" alt="NIC POUCH" />
    </span>
  );
}
