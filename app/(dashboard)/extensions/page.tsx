"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Separator from "@radix-ui/react-separator";
import {
  CheckCircledIcon,
  CopyIcon,
  ExternalLinkIcon,
  InfoCircledIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

export default function InstallExtensionPage() {
  const [copied, setCopied] = useState(false);

  const copyCmd = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14 text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 p-6 md:p-10 dark:from-indigo-500/20 dark:to-cyan-500/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow">
            <RocketIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Cài đặt Extension trong 1 phút
            </h1>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-100">
              Làm theo 3 bước đơn giản bên dưới. Hỗ trợ Chrome, Edge và Firefox.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="https://chromewebstore.google.com/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Mở Chrome Web Store <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-200">
                <InfoCircledIcon /> Yêu cầu trình duyệt phiên bản mới nhất
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StepCard index={1} title="Mở trang Extension">
          Chọn đúng trình duyệt của bạn (Chrome/Edge/Firefox) trong tab bên
          dưới.
        </StepCard>
        <StepCard index={2} title="Nhấn Add / Install">
          Trình duyệt sẽ hỏi xác nhận quyền — chọn <b>“Thêm tiện ích”</b>.
        </StepCard>
        <StepCard index={3} title="Ghim icon lên thanh công cụ">
          Nhấn nút mảnh ghép → bật ghim để dùng nhanh.
        </StepCard>
      </section>

      {/* Tabs by browser */}
      <section className="mt-10">
        <Tabs.Root defaultValue="chrome" className="w-full">
          <div className="flex items-center justify-between">
            <Tabs.List
              className="inline-flex rounded-xl border border-gray-300 p-1 dark:border-gray-700"
              aria-label="Chọn trình duyệt"
            >
              <TabTrigger value="chrome">Chrome</TabTrigger>
              <TabTrigger value="edge">Edge</TabTrigger>
              <TabTrigger value="firefox">Firefox</TabTrigger>
            </Tabs.List>

            <Tooltip.Provider delayDuration={150}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() =>
                      copyCmd(
                        "chrome://extensions/ ; edge://extensions/ ; about:addons"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/5 px-3 py-1.5 text-xs text-white shadow-sm transition hover:bg-white/10 dark:border-gray-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircledIcon className="h-4 w-4" /> Đã copy
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4" /> Copy đường dẫn quản lý
                      </>
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="left"
                  className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white shadow-lg"
                >
                  Nhanh: mở trang quản lý extension
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-300 p-4 dark:border-gray-700 dark:bg-gray-900">
            <Tabs.Content value="chrome">
              <BrowserGuide
                storeName="Chrome Web Store"
                href="https://chromewebstore.google.com/"
                img="/images/stores/chrome.png"
                steps={[
                  "Mở liên kết Chrome Web Store.",
                  "Nhấn Add to Chrome → Add extension.",
                  "Nhấn biểu tượng mảnh ghép → pin extension để hiện icon.",
                ]}
              />
            </Tabs.Content>

            <Tabs.Content value="edge">
              <BrowserGuide
                storeName="Edge Add-ons"
                href="https://microsoftedge.microsoft.com/addons"
                img="/images/stores/edge.png"
                steps={[
                  "Mở Microsoft Edge Add-ons.",
                  "Nhấn Get → Add extension.",
                  "Ghim tiện ích lên thanh công cụ.",
                ]}
              />
            </Tabs.Content>

            <Tabs.Content value="firefox">
              <BrowserGuide
                storeName="Firefox Add-ons"
                href="https://addons.mozilla.org/"
                img="/images/stores/firefox.png"
                steps={[
                  "Mở Firefox Add-ons.",
                  "Nhấn Add to Firefox → Add.",
                  "Vào about:addons để quản lý và bật ghim.",
                ]}
              />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </section>

      {/* Permissions */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-black">
          Quyền mà Extension cần
        </h2>
        <p className="mt-1 text-sm text-gray-700">
          Chúng tôi chỉ yêu cầu các quyền tối thiểu để tính năng hoạt động:
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <PermItem text="Access activeTab — đọc URL tab hiện tại để xử lý nội dung học." />
          <PermItem text="Storage — lưu cấu hình và dữ liệu flashcard cục bộ." />
          <PermItem text="ContextMenus — thêm menu chuột phải để tạo từ vựng nhanh." />
          <PermItem text="Scripting — tiêm script nhẹ vào trang để phát âm/ghi chú." />
        </ul>
        <Separator.Root className="my-8 h-px bg-gray-700" />
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="text-lg font-semibold text-black">
          Khắc phục sự cố thường gặp
        </h2>
        <Accordion.Root
          type="single"
          collapsible
          className="mt-3 space-y-2 rounded-xl"
        >
          <AccordionItem
            value="blocked"
            q="Trình duyệt chặn cài đặt hoặc nút “Add” mờ?"
            a={
              <>
                Kiểm tra phiên bản trình duyệt mới nhất. Với Chrome/Edge, mở{" "}
                <code className="rounded bg-gray-800 px-1">
                  chrome://extensions
                </code>{" "}
                hoặc{" "}
                <code className="rounded bg-gray-800 px-1">
                  edge://extensions
                </code>{" "}
                &rarr; bật <b>Developer mode</b>, sau đó thử lại.
              </>
            }
          />
          <AccordionItem
            value="icon"
            q="Không thấy icon sau khi cài?"
            a={
              <>
                Nhấn biểu tượng <b>mảnh ghép</b> bên phải thanh địa chỉ &rarr;
                bật ghim cho extension. Trên Firefox, vào{" "}
                <code className="rounded bg-gray-800 px-1">about:addons</code>{" "}
                &rarr; Extensions &rarr; bật Pin.
              </>
            }
          />
          <AccordionItem
            value="permission"
            q="Tại sao phải cấp các quyền trên?"
            a={
              <>
                Chỉ dùng để phục vụ tính năng (phát âm, lưu từ, tạo flashcard).
                Không thu thập dữ liệu cá nhân ngoài mục đích tính năng. Bạn có
                thể tắt từng quyền trong trang quản lý extension.
              </>
            }
          />
          <AccordionItem
            value="enterprise"
            q="Máy công ty chặn cài extension?"
            a={
              <>
                Nhiều tổ chức áp chính sách. Hãy liên hệ IT để whitelist ID
                extension hoặc dùng <b>tệp .crx / .xpi</b> nội bộ nếu được phép.
              </>
            }
          />
        </Accordion.Root>
      </section>

      {/* CTA */}
      <section className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-200">
          Cài xong rồi? Mở một trang bất kỳ và thử bôi đậm một từ để tạo
          flashcard nhé!
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/docs/get-started"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 dark:bg-white dark:text-gray-900"
          >
            Xem hướng dẫn sử dụng
          </Link>
          <Link
            href="/support"
            className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-white hover:bg-white/5"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ---------- small UI bits ---------- */

function StepCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-gray-900">
          {index}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-200">{children}</p>
        </div>
      </div>
    </div>
  );
}

function TabTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={[
        "rounded-lg px-3 py-1.5 text-sm font-medium transition bg-gray-500",
        "text-gray-900 hover:bg-gray-200 hover:text-black",
        "dark:text-white dark:hover:bg-white/10",
        "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
        "dark:data-[state=active]:bg-white dark:data-[state=active]:text-gray-900",
      ].join(" ")}
    >
      {children}
    </Tabs.Trigger>
  );
}

function BrowserGuide({
  storeName,
  href,
  img,
  steps,
}: {
  storeName: string;
  href: string;
  img: string;
  steps: string[];
}) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircledIcon className="mt-0.5 h-5 w-5 text-green-400" />
              <span className="text-sm text-white/95">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4">
          <Link
            href={href}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white hover:bg-white/5"
          >
            Mở {storeName} <ExternalLinkIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="order-1 md:order-2">
        <div className="overflow-hidden rounded-xl border border-gray-700">
          <Image
            src={img}
            alt={storeName}
            width={720}
            height={480}
            className="h-auto w-full"
          />
        </div>
        <p className="mt-2 text-xs text-gray-300">
          *Ảnh minh họa. Giao diện thực tế có thể thay đổi theo phiên bản trình
          duyệt.
        </p>
      </div>
    </div>
  );
}

function PermItem({ text }: { text: string }) {
  return (
    <li className="rounded-xl border border-gray-700 bg-gray-900 p-3 text-sm text-white">
      {text}
    </li>
  );
}

function AccordionItem({
  value,
  q,
  a,
}: {
  value: string;
  q: string;
  a: React.ReactNode;
}) {
  return (
    <Accordion.Item
      value={value}
      className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-white/5 data-[state=open]:bg-white/5">
          {q}
          <span className="ml-4 text-xs text-gray-300">▼</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-4 pb-4 pt-2 text-sm text-white/95">
        {a}
      </Accordion.Content>
    </Accordion.Item>
  );
}
