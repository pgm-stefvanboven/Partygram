import { QueryKey } from "@tanstack/react-query";
import { FlatList, ListRenderItem } from "react-native";
import DataView from "./DataView";
import EmptyView from "@design/View/EmptyView";
import DefaultView from "@design/View/DefaultView";
import Divider from "@design/List/Divider";

type Props<T> = {
  name: QueryKey;
  method: () => Promise<T[] | null>;
  emptyTitle: string;
  emptyIcon: string;
  emptyDescription: string;
  onAddItem: () => void;
  renderItem: ListRenderItem<T>;
};

const DataListView = <T extends { id: number }>({
  method,
  name,
  renderItem,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onAddItem,
}: Props<T>) => {
  return (
    <DataView
      method={method}
      name={name}
      render={(data: T[]) => {
        if (data.length === 0) {
          return (
            <EmptyView
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              onPress={onAddItem}
            />
          );
        }

        return (
          <DefaultView padding={false}>
            <FlatList
              data={data}
              keyExtractor={(item) => String(item.id)}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={renderItem}
            />
          </DefaultView>
        );
      }}
    />
  );
};

export default DataListView;
