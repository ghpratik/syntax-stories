import {
  BundledTheme,
  codeToHtml,
  StringLiteralUnion,
  ThemeRegistrationAny,
} from "shiki";
import { CopyButton } from "./CopyButton";

const theme: ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string> =
  "one-dark-pro";

export async function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename: string;
}) {
  const html = await codeToHtml(code, {
    lang: language,
    theme,
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5 uppercase tracking-wide">
            {language}
          </span>
          {filename ? <span>{filename}</span> : null}
        </div>

        <CopyButton code={code} />
      </div>

      <div
        className="[&>pre]:m-0! [&>pre]:overflow-x-auto [&>pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
