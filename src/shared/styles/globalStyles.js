import { StyleSheet } from "react-native";
import { theme } from "./theme";

const globalStyles = StyleSheet.create({
  // Styles for layout
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flexDirection: "column",
    marginTop: 15,
    paddingBottom: 15,
    width: "100%",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rowContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatList: {
    flex: 1,
    width: "100%",
    paddingBottom: 10,
  },

  // Styles for text
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 20,
  },
  textCenter: {
    alignSelf: "center",
    paddingTop: 10,
  },
  textInPrimaryColor: {
    alignSelf: "center",
    color: theme.colors.primary,
    fontSize: 12,
    paddingBottom: 10,
    paddingTop: 12,
  },
  checkboxLabel: {
    fontSize: 18,
  },

  // Styles for cards
  card: {
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    flexDirection: "column",
    marginTop: 15,
    paddingBottom: 15,
    width: "100%",
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardDisabled: {
    backgroundColor: theme.colors.disabled,
  },

  // Styles for other components
  input: {
    marginBottom: 10,
    padding: 10,
    height: 40,
  },
  listTile: {
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    marginVertical: 5,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  chip: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.background,
    marginRight: 10,
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    backgroundColor: theme.colors.disabled,
    marginVertical: 10,
  },
  head: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
  },
});

export default globalStyles;
