import { create } from "zustand";
import { FileStoreType } from "../types/store/file";
import { BucketType, FileWithPath } from "../types/file";
import { checkFileType } from "@/components/Dropzone/utils";
import { createJSONStorage, persist } from "zustand/middleware";
import { idbStorage } from "./storage";

const merge = (a: FileWithPath[], b: FileWithPath[], predicate: Function) => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) =>
    c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)
  );
  return c;
};

export const useTest = create<FileStoreType>()(
  persist<FileStoreType>(
    (set, get) => ({
      bucket: { "/": [] },
      setBucket: (bucket: BucketType) => set((state) => ({ ...state, bucket })),
      // showFilePicker
      mergeFileListToBucket: (fileList: FileList | null) => {
        if (!fileList) {
          return;
        }
        const curr = { ...get().bucket };
        set((state) => ({
          ...state,
          bucket: {
            ...curr,
            "/": merge(
              [...curr["/"]],
              Array.from(fileList).map((file) => {
                const type = checkFileType(file);
                const media = type === "image" || type === "video";
                return {
                  dir: false,
                  type,
                  path: `/` + file.name,
                  file,
                  url: media ? URL.createObjectURL(file) : "",
                };
              }),
              (a: FileWithPath, b: FileWithPath) => a.path === b.path
            ),
          },
        }));
        // console.log(get().bucket);
      },
      mergeBucket: (bucket: BucketType) => {
        let curr = { ...get().bucket }; // copy to avoid side effects
        Object.keys(bucket).forEach((k) => {
          if (k in curr) {
            curr[k] = merge(
              curr[k],
              bucket[k],
              (a: FileWithPath, b: FileWithPath) => a.path === b.path
            );
          } else {
            curr[k] = bucket[k];
          }
        });
        set((state) => ({ ...state, bucket: curr }));
      },
    }),
    {
      name: "test",
      storage: createJSONStorage(() => idbStorage),
      // @ts-ignore
      // partialize: (state) =>
      //   Object.fromEntries(
      //     Object.entries(state).filter(
      //       ([key]) =>
      //         !["currentProjectId"].includes(key) &&
      //         !["canvas"].includes(key) &&
      //         !["disableKeyboardShortcut"].includes(key) &&
      //         !["playing"].includes(key) &&
      //         !["maxTime"].includes(key) &&
      //         !["currentKeyFrame"].includes(key) &&
      //         !["startedTime"].includes(key) &&
      //         !["startedTimePlay"].includes(key)
      //     )
      //   ),
    }
  )
);
