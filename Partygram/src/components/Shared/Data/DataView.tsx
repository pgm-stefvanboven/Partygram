import useTitle from "@core/hooks/useTitle";
import LoadingIndicator from "@design/LoadingIndicator";
import ErrorMessage from "@design/Text/ErrorMessage";
import CenteredView from "@design/View/CenteredView";
import DefaultView from "@design/View/DefaultView";
import { QueryKey, useQuery } from "@tanstack/react-query";

type Props<T> = {
  name: QueryKey;
  method: () => Promise<T | null>;
  render: (data: T) => React.ReactNode;
  getTitle?: (data: T) => string;
  showTitle?: boolean;
};

const DataView = <T extends Object>({ name, method, render, getTitle, showTitle = false }: Props<T>) => {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: method,
    queryKey: name,
  });

  useTitle(showTitle ? (data && getTitle ? getTitle(data) : "") : null);

  if (isLoading) {
    return (
      <CenteredView>
        <LoadingIndicator />
      </CenteredView>
    );
  }

  if (isError) {
    return (
      <DefaultView>
        <ErrorMessage error={error} />
      </DefaultView>
    );
  }

  if (!data) {
    return (
      <DefaultView>
        <ErrorMessage error="Does not exist" />
      </DefaultView>
    );
  }

  return render(data);
};

export default DataView;
