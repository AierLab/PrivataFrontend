import {
  ArrowDownTrayIcon,
  AtSymbolIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { People } from "@privata/types/people";
import { forwardRef, ReactElement } from "react";
import { modulize } from "utils/classNames";
import styles from "./index.module.css";

import { humanizeFileSize } from "utils/humanize";

import Tooltip from "components/Tooltip/index";
import { TableCellsIcon } from "@heroicons/react/24/solid";

// TODO: how to download? by open a link in browser
// or as background job?

export enum ValidFileTypeEnum {
  TXT = ".txt",
  PDF = ".pdf",
  DOC = ".doc",
  DOCX = ".docx",
  MD = ".md",
  XLS = ".xls",
}
export type ValidFileType = keyof ValidFileTypeEnum;

export enum TabIDsEnum {
  ReportsReview = "reports-review",
  StudyAbroadPlanning = "study-abroad-planning",
}

export interface FileCardCommonProps {
  tab: TabIDsEnum;

  className?: string;

  filetype: ValidFileTypeEnum;
  filesize: number;
  filename: string;
  uploadProgress: number; // percentage, i.e. 0 - 1

  done: boolean;
  // TODO
  overview: string;

  mentionables: People[];
  mentioned: People[];

  onMentionAppend?: (p: People) => void;
  onMentionDelete?: (p: People) => void;
}

export interface FileCardReviewProps {
  grade: number;
}

export interface FileCardPlanningProps {
  // result: string;
}

export type FileCardProps = FileCardCommonProps &
  (FileCardReviewProps | FileCardPlanningProps);

export function FileCard(props: FileCardProps) {
  const s = modulize(styles);
  const strokeEnd = (1 - props.uploadProgress) * 2 * Math.PI * 6;

  const handleOverviewCopy = () => {
    if (!props.done) return;
    window.api.setClipboard(props.overview);
  };

  return (
    <div className={s("container", props.className || "")}>
      <div className={s("card horizontal shadow")}>
        <div className="flex flex-row space-x-4 items-center flex-1 w-0">
          <DocumentIcon type={props.filetype} />
          <div className={s("file-info-wrap")}>
            <span className={s("file-name")}> {props.filename} </span>
            <span className={s("file-size")}>
              {humanizeFileSize(props.filesize)}
            </span>
          </div>
        </div>

        {!props.done &&
          (props.uploadProgress !== 1 ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-rotate-90"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#5855FF"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 6}
                strokeDashoffset={strokeEnd}
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#5855FF"
                strokeOpacity="0.08"
                strokeWidth="4"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#5855FF"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 6}
                strokeDashoffset={(1 - 0.25) * 2 * Math.PI * 6}
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#5855FF"
                strokeOpacity="0.08"
                strokeWidth="4"
              />
            </svg>
          ))}
        {props.done && (
          <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
        )}
      </div>
      {/* {props.done && ( */}
      {
        <div className={s("card vertical shadow")}>
          {props.tab && (
            <div className="w-full">
              <h2> 处理结果 </h2>
              <DashedSparator className={s("my-4")} />
              <pre className={s("overview white-space:pre")}>
                {props.overview}
              </pre>
              <DashedSparator className={s("my-4")} />
              {/* <div className={s("card horizontal bordered")}>
                <div className="flex flex-row space-x-4 items-center flex-1 w-0">
                  <DocumentIcon type={props.filetype} />
                  <div className={s("file-info-wrap")}>
                    <span
                      className={s(
                        "file-name text-indigo-500 dark:text-indigo-300"
                      )}
                    >
                      {props.filename}
                    </span>
                    <span className={s("file-size")}>
                      {humanizeFileSize(props.filesize)}
                    </span>
                  </div>
                </div>
                <button className="h-9 w-9 p-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline focus:outline-neutral-100 dark:focus:outline-neutral-600 transition duration-100">
                  <ArrowDownTrayIcon className="h-full w-full" />
                </button>
              </div>
              <Mention
                mentioned={props.mentioned}
                mentionables={props.mentionables}
                onCopyOverview={handleOverviewCopy}
              /> */}
            </div>
          )}
          {props.tab === TabIDsEnum.ReportsReview && "grade" in props && (
            <div className="w-full">
              <h2> 评分结果 </h2>
              <span className={s("grade")}>{props.grade} 分</span>
              <DashedSparator className={s("my-4")} />
              <p className={s("overview")}>{props.overview}</p>
              <DashedSparator className="my-4" />
              <Mention
                mentioned={props.mentioned}
                mentionables={props.mentionables}
                onCopyOverview={handleOverviewCopy}
              />
            </div>
          )}
        </div>
      }
    </div>
  );
}

interface MentionProps {
  mentioned: People[];
  mentionables: People[];
  onDelete?: (p: People) => void;
  onAppend?: (p: People) => void;
  onCopyOverview?: () => void;
}

function Mention(props: MentionProps) {
  const s = modulize(styles);

  return (
    <div className="w-full flex justify-between items-center flex-wrap mt-2">
      <div className={s("mentions")}>
        {props.mentioned.map((p) => (
          <MentionCard key={p.id} people={p} onDelete={props.onDelete} />
        ))}
      </div>
      <div className="ml-auto">
        <Tooltip content="复制文本信息">
          <button
            className="w-7 h-7 p-1 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700"
            onClick={props.onCopyOverview}
          >
            <ClipboardDocumentIcon className="w-full h-full" />
          </button>
        </Tooltip>
        <Tooltip content="提醒用户查看文件">
          <button className="w-7 h-7 p-1 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700">
            <AtSymbolIcon className="w-full h-full" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

function MentionCard({
  people,
  onDelete,
}: {
  people: People;
  onDelete?: (p: People) => void;
}) {
  const s = modulize(styles);

  return (
    <div className={s("mention-card")}>
      <span> @{people.username} </span>
      <button
        className="w-4 h-4 p-[2px] text-black dark:text-white rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700"
        onClick={() => onDelete && onDelete(people)}
      >
        <XMarkIcon className="w-full h-full" />
      </button>
    </div>
  );
}

function DashedSparator({ className }: { className?: string }) {
  return (
    <svg
      width="2"
      height="2"
      fill="none"
      xmlns="http://www.w4.org/2000/svg"
      className={`w-full ${className}`}
    >
      <line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeLinecap="round"
        strokeDasharray="1 3"
      />
    </svg>
  );
}

export function DocumentIcon({
  type,
  classNames,
}: {
  type: ValidFileTypeEnum;
  classNames?: string;
}) {
  const mappings: Record<ValidFileTypeEnum, ReactElement> = {
    ".txt": <TxtIcon className={classNames} />,
    ".pdf": <PdfIcon className={classNames} />,
    ".doc": <DocIcon className={classNames} />,
    ".docx": <DocIcon className={classNames} />,
    ".md": <TxtIcon className={classNames} />,
    ".xls": <ExcelIcon className={classNames} />,
  };

  return mappings[type];
}

const PdfIcon = forwardRef<SVGSVGElement, React.HTMLProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        {...props}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 6C5 3.79086 6.79086 2 9 2H27C31.4183 2 35 5.58172 35 10V34C35 36.2091 33.2091 38 31 38H9C6.79086 38 5 36.2091 5 34V6Z"
          fill="#FF80AB"
        />
        <path
          d="M26.5 3.5C30.366 3.5 33.5 6.63401 33.5 10.5H26.5V3.5Z"
          fill="white"
        />
        <path
          d="M12.0499 15.216C12.7859 15.216 13.4259 15.34 13.9699 15.588C14.5139 15.828 14.9299 16.172 15.2179 16.62C15.5139 17.068 15.6619 17.592 15.6619 18.192C15.6619 18.792 15.5139 19.316 15.2179 19.764C14.9299 20.212 14.5139 20.56 13.9699 20.808C13.4259 21.048 12.7859 21.168 12.0499 21.168H10.9219V24H8.86986V15.216H12.0499ZM11.8219 19.44C12.3179 19.44 12.7219 19.344 13.0339 19.152C13.3459 18.96 13.5019 18.64 13.5019 18.192C13.5019 17.752 13.3419 17.436 13.0219 17.244C12.7099 17.044 12.3099 16.944 11.8219 16.944H10.9219V19.44H11.8219ZM19.9246 15.216C20.7806 15.216 21.5566 15.388 22.2526 15.732C22.9486 16.076 23.4966 16.58 23.8966 17.244C24.3046 17.9 24.5086 18.684 24.5086 19.596C24.5086 20.508 24.3046 21.296 23.8966 21.96C23.4966 22.624 22.9486 23.132 22.2526 23.484C21.5646 23.828 20.7886 24 19.9246 24H16.7566V15.216H19.9246ZM19.6966 22.272C20.5686 22.272 21.2286 22.04 21.6766 21.576C22.1246 21.112 22.3486 20.452 22.3486 19.596C22.3486 18.748 22.1206 18.096 21.6646 17.64C21.2166 17.176 20.5606 16.944 19.6966 16.944H18.8086V22.272H19.6966ZM25.8386 15.216H31.7186V17.004H27.8906V18.924H31.3226V20.7H27.8906V24H25.8386V15.216Z"
          fill="#E91E63"
        />
      </svg>
    );
  }
);

const TxtIcon = forwardRef<SVGSVGElement, React.HTMLProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        {...props}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 6C5 3.79086 6.79086 2 9 2H27C31.4183 2 35 5.58172 35 10V34C35 36.2091 33.2091 38 31 38H9C6.79086 38 5 36.2091 5 34V6Z"
          fill="#FF7043"
        />
        <path
          d="M26.5 3.5C30.366 3.5 33.5 6.63401 33.5 10.5H26.5V3.5Z"
          fill="white"
        />
        <path
          d="M8.14845 15.216H15.4685V17.028H12.8285V24H10.7885V17.028H8.14845V15.216ZM24.2527 15.216L21.1807 19.476L24.4087 24H21.8767L19.9207 21.144L17.9287 24H15.5767L18.8047 19.524L15.7327 15.216H18.2407L20.0527 17.856L21.8887 15.216H24.2527ZM24.5313 15.216H31.8513V17.028H29.2113V24H27.1713V17.028H24.5313V15.216Z"
          fill="#B83819"
        />
      </svg>
    );
  }
);

const DocIcon = forwardRef<SVGSVGElement, React.HTMLProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        {...props}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 6C5 3.79086 6.79086 2 9 2H27C31.4183 2 35 5.58172 35 10V34C35 36.2091 33.2091 38 31 38H9C6.79086 38 5 36.2091 5 34V6Z"
          fill="#9CCC65"
        />
        <path
          d="M26.5 3.5C30.366 3.5 33.5 6.63401 33.5 10.5H26.5V3.5Z"
          fill="white"
        />
        <path
          d="M10.0672 15.216C10.9232 15.216 11.6992 15.388 12.3952 15.732C13.0912 16.076 13.6392 16.58 14.0392 17.244C14.4472 17.9 14.6512 18.684 14.6512 19.596C14.6512 20.508 14.4472 21.296 14.0392 21.96C13.6392 22.624 13.0912 23.132 12.3952 23.484C11.7072 23.828 10.9312 24 10.0672 24H6.89916V15.216H10.0672ZM9.83916 22.272C10.7112 22.272 11.3712 22.04 11.8192 21.576C12.2672 21.112 12.4912 20.452 12.4912 19.596C12.4912 18.748 12.2632 18.096 11.8072 17.64C11.3592 17.176 10.7032 16.944 9.83916 16.944H8.95116V22.272H9.83916ZM15.5732 19.596C15.5732 18.668 15.7612 17.86 16.1372 17.172C16.5212 16.484 17.0412 15.96 17.6972 15.6C18.3532 15.232 19.0772 15.048 19.8692 15.048C20.6612 15.048 21.3812 15.232 22.0292 15.6C22.6852 15.96 23.2052 16.484 23.5892 17.172C23.9732 17.86 24.1652 18.668 24.1652 19.596C24.1652 20.532 23.9732 21.344 23.5892 22.032C23.2052 22.72 22.6852 23.248 22.0292 23.616C21.3812 23.976 20.6612 24.156 19.8692 24.156C19.0692 24.156 18.3412 23.976 17.6852 23.616C17.0372 23.248 16.5212 22.72 16.1372 22.032C15.7612 21.344 15.5732 20.532 15.5732 19.596ZM17.7452 19.596C17.7452 20.132 17.8332 20.604 18.0092 21.012C18.1932 21.42 18.4452 21.736 18.7652 21.96C19.0852 22.176 19.4532 22.284 19.8692 22.284C20.2852 22.284 20.6532 22.176 20.9732 21.96C21.3012 21.736 21.5532 21.42 21.7292 21.012C21.9132 20.604 22.0052 20.132 22.0052 19.596C22.0052 19.068 21.9132 18.604 21.7292 18.204C21.5532 17.796 21.3012 17.484 20.9732 17.268C20.6532 17.044 20.2852 16.932 19.8692 16.932C19.4532 16.932 19.0852 17.044 18.7652 17.268C18.4452 17.484 18.1932 17.796 18.0092 18.204C17.8332 18.604 17.7452 19.068 17.7452 19.596ZM29.3371 22.272C30.1291 22.272 30.7051 21.856 31.0651 21.024L32.7811 22.032C32.6531 22.416 32.4331 22.772 32.1211 23.1C31.8091 23.42 31.4171 23.676 30.9451 23.868C30.4811 24.06 29.9611 24.156 29.3851 24.156C28.5931 24.156 27.8691 23.968 27.2131 23.592C26.5571 23.216 26.0371 22.684 25.6531 21.996C25.2691 21.3 25.0771 20.5 25.0771 19.596C25.0771 18.692 25.2691 17.896 25.6531 17.208C26.0371 16.52 26.5571 15.988 27.2131 15.612C27.8691 15.236 28.5931 15.048 29.3851 15.048C29.9611 15.048 30.4811 15.144 30.9451 15.336C31.4171 15.528 31.8091 15.788 32.1211 16.116C32.4331 16.436 32.6531 16.788 32.7811 17.172L31.0651 18.18C30.7051 17.348 30.1291 16.932 29.3371 16.932C28.9451 16.932 28.5891 17.04 28.2691 17.256C27.9571 17.464 27.7051 17.772 27.5131 18.18C27.3291 18.58 27.2371 19.052 27.2371 19.596C27.2371 20.14 27.3291 20.616 27.5131 21.024C27.7051 21.432 27.9571 21.744 28.2691 21.96C28.5891 22.168 28.9451 22.272 29.3371 22.272Z"
          fill="#33691E"
        />
      </svg>
    );
  }
);

const ExcelIcon = forwardRef<SVGSVGElement, React.HTMLProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        {...props}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"

        // stroke-width="1.5"
        // stroke="currentColor"
        // class="w-6 h-6"
      >
        {/* <path
          d="M5 6C5 3.79086 6.79086 2 9 2H27C31.4183 2 35 5.58172 35 10V34C35 36.2091 33.2091 38 31 38H9C6.79086 38 5 36.2091 5 34V6Z"
          fill="#9CCC65"
        />
        <path
          d="M26.5 3.5C30.366 3.5 33.5 6.63401 33.5 10.5H26.5V3.5Z"
          fill="white"
        /> */}
        <path
          // stroke-linecap="round"
          // stroke-linejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
          fill="#9ECC65"
        />
      </svg>
    );
  }
);
