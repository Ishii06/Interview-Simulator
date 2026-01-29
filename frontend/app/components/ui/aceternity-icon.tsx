"use client";

interface AceternityIconProps {
  order: string;
}

export const AceternityIcon = ({ order }: AceternityIconProps) => {
  return (
    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
      <span className="text-sm font-semibold text-white">
        {order}
      </span>
    </div>
  );
};
