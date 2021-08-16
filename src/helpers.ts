import { IQueryFileOptions, QueryFile } from "pg-promise";

/**
 * See QueryFile API:
 * http://vitaly-t.github.io/pg-promise/QueryFile.html
 */
export function getQueryFile(fullPath: string): QueryFile {
  const options: IQueryFileOptions = {
    // see also option 'compress' in the API;
    minify: true,
  };

  const qf: QueryFile = new QueryFile(fullPath, options);

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
}
