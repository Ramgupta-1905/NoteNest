function BackgroundBubbles({ isDarkMode = false }) {
  const bubbleOpacity = isDarkMode
    ? 'opacity-35'
    : 'opacity-100'

  return (
    <>
      {/* Soft background colour bubbles */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[-9rem] top-[-8rem] z-0 size-[430px] rounded-full bg-[radial-gradient(circle,rgba(105,139,218,0.30)_0%,rgba(132,158,224,0.17)_48%,transparent_74%)] blur-2xl transition-opacity duration-300 ${bubbleOpacity}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[-10rem] right-[-8rem] z-0 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(145,119,211,0.28)_0%,rgba(169,148,222,0.16)_50%,transparent_74%)] blur-2xl transition-opacity duration-300 ${bubbleOpacity}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[48%] top-[28%] z-0 size-[330px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,177,211,0.22)_0%,rgba(148,194,220,0.12)_48%,transparent_74%)] blur-2xl transition-opacity duration-300 ${bubbleOpacity}`}
      />

      {/* Soft glow behind the sidebar */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[-2rem] top-[34%] z-0 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(106,126,202,0.25)_0%,rgba(146,132,210,0.14)_48%,transparent_74%)] blur-2xl transition-opacity duration-300 ${bubbleOpacity}`}
      />

      {/* Translucent clay-style bubbles */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-[24%] top-[-4rem] z-0 size-56 rounded-full border-[2px] border-white/50 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.62),rgba(157,180,235,0.20)_46%,rgba(117,151,231,0.03)_72%)] shadow-[inset_10px_12px_24px_rgba(255,255,255,0.45),12px_16px_30px_rgba(78,101,173,0.12)] blur-[1px] transition-opacity duration-300 ${bubbleOpacity}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-[8%] top-[44%] z-0 size-36 rounded-full border border-white/55 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.70),rgba(180,163,229,0.22)_48%,rgba(151,128,222,0.04)_74%)] shadow-[inset_8px_10px_18px_rgba(255,255,255,0.48),10px_14px_24px_rgba(94,78,159,0.12)] transition-opacity duration-300 ${bubbleOpacity}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[30%] bottom-[-5rem] z-0 size-64 rounded-full border-2 border-white/45 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.58),rgba(151,197,224,0.20)_48%,rgba(102,174,219,0.03)_74%)] shadow-[inset_10px_12px_22px_rgba(255,255,255,0.42),12px_16px_28px_rgba(72,113,160,0.13)] transition-opacity duration-300 ${bubbleOpacity}`}
      />
    </>
  )
}

export default BackgroundBubbles