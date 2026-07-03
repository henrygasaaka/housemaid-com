type PhoneFrameProps = {
  children: React.ReactNode;
};

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-canvas">
      <div className="phone-shell">{children}</div>
    </div>
  );
}
