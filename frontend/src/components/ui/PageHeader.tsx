interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

const PageHeader = ({ title, breadcrumb, subtitle }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <p className="text-text-secondary text-sm mb-1 font-medium">
          {breadcrumb}
        </p>
      )}
      <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
