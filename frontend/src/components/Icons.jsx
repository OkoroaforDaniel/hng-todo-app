/**
 * The little line icons used across the app.
 *
 * They are plain inline SVG (no icon library) so the shapes live right here and
 * every icon takes its colour from the text around it via `currentColor`.
 */

function Icon({ size = 18, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" />
    </Icon>
  );
}

export function TodayIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3.2" />
      <path d="M8 3v4M16 3v4M3 10.5h18" />
      <path d="M9 15.5l2 2 4-4.5" />
    </Icon>
  );
}

export function TasksIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </Icon>
  );
}

export function StatsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20V11M10 20V4.5M16 20v-6M22 20H2" />
    </Icon>
  );
}

export function DocsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Icon>
  );
}

export function LayersIcon(props) {
  return (
    <Icon {...props}>
      <path d="m12 3 9 4.8-9 4.8-9-4.8z" />
      <path d="m3 12 9 4.8 9-4.8" />
      <path d="m3 16.4 9 4.8 9-4.8" />
    </Icon>
  );
}

export function PlusIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Icon>
  );
}

export function SearchIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4-4" />
    </Icon>
  );
}

export function UserIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5c.7-4 3.8-6 7.5-6s6.8 2 7.5 6" />
    </Icon>
  );
}

export function DotsIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function ArrowUpIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
    </Icon>
  );
}

export function ArrowDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5.5 12.5 12 19l6.5-6.5" />
    </Icon>
  );
}

export function PencilIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20.5h4.2L19 9.7a2.9 2.9 0 0 0-4.1-4.1L4 16.3z" />
      <path d="m13.6 6.9 3.5 3.5" />
    </Icon>
  );
}

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16M9.5 10.5v7M14.5 10.5v7M6 6.5 7 20h10l1-13.5" />
      <path d="M9.5 6.5V3.5h5v3" />
    </Icon>
  );
}

export function GripIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function ListIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.5" width="18" height="5.5" rx="2.4" />
      <rect x="3" y="14" width="18" height="5.5" rx="2.4" />
    </Icon>
  );
}

export function GridIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2.4" />
      <rect x="13" y="3" width="8" height="8" rx="2.4" />
      <rect x="3" y="13" width="8" height="8" rx="2.4" />
      <rect x="13" y="13" width="8" height="8" rx="2.4" />
    </Icon>
  );
}

export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Icon>
  );
}

export function CrossIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function TargetIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </Icon>
  );
}

export function SparkIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 13.8 9 19.5 11l-5.7 2L12 18.5 10.2 13 4.5 11 10.2 9z" />
    </Icon>
  );
}

export function ArchiveIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="4.5" rx="1.8" />
      <path d="M5 8.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5M10 13h4" />
    </Icon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </Icon>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Icon>
  );
}

export function SortIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h10M4 12h7M4 17h4M17 5v14" />
      <path d="m14 16 3 3 3-3" />
    </Icon>
  );
}
