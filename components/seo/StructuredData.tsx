import Script from "next/script";

interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${typeof data === "object" ? data["@type"] : "generic"}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
}

export function MultipleStructuredData({ dataArray }: { dataArray: any[] }) {
  return (
    <>
      {dataArray.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
    </>
  );
}
