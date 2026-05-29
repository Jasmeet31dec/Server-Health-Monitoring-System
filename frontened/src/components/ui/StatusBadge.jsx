export const StatusBadge = ({ status }) => {
  const config = {
    HEALTHY: { color: 'bg-green-500', text: 'Healthy', icon: '●' },
    HIGH_LOAD: { color: 'bg-red-500', text: 'High Load', icon: '▲' },
    OFFLINE: { color: 'bg-slate-500', text: 'Offline', icon: '○' }
  };

  const current = config[status] || config.OFFLINE;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white ${current.color} animate-pulse`}>
      <span>{current.icon}</span>
      <span>{current.text}</span>
    </div>
  );
};