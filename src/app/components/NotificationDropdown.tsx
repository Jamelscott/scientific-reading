import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Notification {
  id: number;
  type: "success" | "warning" | "info";
  key: string;
  read: boolean;
}

const notificationKeys = [
  { id: 1, type: "success" as const, key: "evalCompleted", read: false },
  { id: 2, type: "info" as const, key: "newReport", read: false },
  { id: 3, type: "warning" as const, key: "evalReminder", read: true },
  { id: 4, type: "info" as const, key: "systemUpdate", read: true },
  { id: 5, type: "success" as const, key: "studentAdded", read: true },
];

export function NotificationDropdown() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationKeys);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: "success" | "warning" | "info") => {
    if (type === "success")
      return <CheckCircle className="w-5 h-5" style={{ color: "#c9e265" }} />;
    if (type === "warning")
      return <AlertCircle className="w-5 h-5" style={{ color: "#ff5757" }} />;
    return <Info className="w-5 h-5" style={{ color: "#38b6ff" }} />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl relative"
        style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
      >
        <Bell className="w-5 h-5" style={{ color: "#004aad" }} />
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ background: "#ff5757", color: "#ffffff" }}
          >
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl z-50"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          {/* Header */}
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: "#dff3ff" }}
          >
            <h3 className="text-lg" style={{ color: "#004aad" }}>
              {t("notifications.title")}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm"
                style={{ color: "#38b6ff" }}
              >
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: "#000000" }}>
                <Bell
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "#dff3ff" }}
                />
                <p>{t("notifications.empty")}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b hover:bg-opacity-50 transition-all"
                  style={{
                    borderColor: "#dff3ff",
                    background: notification.read ? "#ffffff" : "#dff3ff",
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm" style={{ color: "#004aad" }}>
                          {t(`notifications.items.${notification.key}.title`)}
                        </h4>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 p-1 rounded hover:bg-white transition-all"
                        >
                          <X className="w-4 h-4" style={{ color: "#000000" }} />
                        </button>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "#000000" }}>
                        {t(`notifications.items.${notification.key}.message`)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: "#000000", opacity: 0.6 }}
                        >
                          {t(`notifications.items.${notification.key}.time`)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                            style={{ color: "#38b6ff" }}
                          >
                            {t("notifications.markAsRead")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              className="p-3 border-t text-center"
              style={{ borderColor: "#dff3ff" }}
            >
              <button className="text-sm" style={{ color: "#38b6ff" }}>
                {t("notifications.viewAll")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
