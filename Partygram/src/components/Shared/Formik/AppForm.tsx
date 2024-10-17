import { Formik, FormikConfig } from "formik";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

type Props<T> = {
  children: React.ReactNode;
} & FormikConfig<T>;

const AppForm = <T extends Object>({ children, ...rest }: Props<T>) => {
  return (
    <Formik validateOnMount={true} {...rest}>
      {() => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          {/* If keyboardShouldPersistTaps="always" is not added, double tap is required */}
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default AppForm;
