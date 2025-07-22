/**
 * Purpose: Provides pre-built query templates for common SQL operations
 * Features: Collection of template objects with descriptions and customizable parameters
 * Used in: Template selector component and query generation
 */

export interface QueryTemplate {
  id: string
  name: string
  description: string
  category: "basic" | "aggregation" | "join" | "advanced" | "modification"
  naturalLanguage: string
  sqlTemplate: string
  parameters?: {
    name: string
    description: string
    type: "text" | "number" | "select"
    options?: string[]
    default?: string | number
  }[]
}

export const queryTemplates: QueryTemplate[] = [
  // Basic Queries
  {
    id: "select-all",
    name: "Select All Records",
    description: "Retrieve all records from a table",
    category: "basic",
    naturalLanguage: "Show me all records from the {table} table",
    sqlTemplate: "SELECT * FROM {table};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },
  {
    id: "select-columns",
    name: "Select Specific Columns",
    description: "Retrieve specific columns from a table",
    category: "basic",
    naturalLanguage: "Show me {columns} from the {table} table",
    sqlTemplate: "SELECT {columns} FROM {table};",
    parameters: [
      {
        name: "columns",
        description: "Comma-separated column names",
        type: "text",
        default: "id, name, price",
      },
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },
  {
    id: "filter-records",
    name: "Filter Records",
    description: "Retrieve records that match specific criteria",
    category: "basic",
    naturalLanguage: "Show me records from {table} where {column} {operator} {value}",
    sqlTemplate: "SELECT * FROM {table} WHERE {column} {operator} {value};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "column",
        description: "Column to filter on",
        type: "text",
        default: "price",
      },
      {
        name: "operator",
        description: "Comparison operator",
        type: "select",
        options: ["=", ">", "<", ">=", "<=", "<>", "LIKE", "IN", "BETWEEN"],
        default: ">",
      },
      {
        name: "value",
        description: "Value to compare against",
        type: "text",
        default: "100",
      },
    ],
  },
  {
    id: "sort-records",
    name: "Sort Records",
    description: "Retrieve records sorted by specific columns",
    category: "basic",
    naturalLanguage: "Show me all records from {table} sorted by {column} in {order} order",
    sqlTemplate: "SELECT * FROM {table} ORDER BY {column} {order};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "column",
        description: "Column to sort by",
        type: "text",
        default: "price",
      },
      {
        name: "order",
        description: "Sort order",
        type: "select",
        options: ["ASC", "DESC"],
        default: "DESC",
      },
    ],
  },
  {
    id: "limit-records",
    name: "Limit Records",
    description: "Retrieve a limited number of records",
    category: "basic",
    naturalLanguage: "Show me the top {limit} records from {table}",
    sqlTemplate: "SELECT * FROM {table} LIMIT {limit};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "limit",
        description: "Number of records to retrieve",
        type: "number",
        default: 10,
      },
    ],
  },

  // Aggregation Queries
  {
    id: "count-records",
    name: "Count Records",
    description: "Count the number of records in a table",
    category: "aggregation",
    naturalLanguage: "Count the number of records in the {table} table",
    sqlTemplate: "SELECT COUNT(*) as count FROM {table};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },
  {
    id: "sum-values",
    name: "Sum Values",
    description: "Calculate the sum of values in a column",
    category: "aggregation",
    naturalLanguage: "Calculate the sum of {column} in the {table} table",
    sqlTemplate: "SELECT SUM({column}) as total FROM {table};",
    parameters: [
      {
        name: "column",
        description: "Column to sum",
        type: "text",
        default: "price",
      },
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },
  {
    id: "average-values",
    name: "Average Values",
    description: "Calculate the average of values in a column",
    category: "aggregation",
    naturalLanguage: "Calculate the average {column} in the {table} table",
    sqlTemplate: "SELECT AVG({column}) as average FROM {table};",
    parameters: [
      {
        name: "column",
        description: "Column to average",
        type: "text",
        default: "price",
      },
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },
  {
    id: "group-by",
    name: "Group By",
    description: "Group records and calculate aggregates",
    category: "aggregation",
    naturalLanguage: "Show me the {aggregate} of {value_column} grouped by {group_column} in the {table} table",
    sqlTemplate: "SELECT {group_column}, {aggregate}({value_column}) as result FROM {table} GROUP BY {group_column};",
    parameters: [
      {
        name: "aggregate",
        description: "Aggregate function",
        type: "select",
        options: ["COUNT", "SUM", "AVG", "MAX", "MIN"],
        default: "SUM",
      },
      {
        name: "value_column",
        description: "Column to aggregate",
        type: "text",
        default: "price",
      },
      {
        name: "group_column",
        description: "Column to group by",
        type: "text",
        default: "category",
      },
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
    ],
  },

  // Join Queries
  {
    id: "inner-join",
    name: "Inner Join",
    description: "Combine rows from two tables based on a related column",
    category: "join",
    naturalLanguage:
      "Show me data from {table1} joined with {table2} where {table1}.{column1} equals {table2}.{column2}",
    sqlTemplate: "SELECT * FROM {table1} INNER JOIN {table2} ON {table1}.{column1} = {table2}.{column2};",
    parameters: [
      {
        name: "table1",
        description: "First table",
        type: "select",
        options: ["orders", "customers", "products", "employees", "regions"],
        default: "orders",
      },
      {
        name: "column1",
        description: "Column from first table",
        type: "text",
        default: "customer_id",
      },
      {
        name: "table2",
        description: "Second table",
        type: "select",
        options: ["customers", "orders", "products", "employees", "regions"],
        default: "customers",
      },
      {
        name: "column2",
        description: "Column from second table",
        type: "text",
        default: "id",
      },
    ],
  },
  {
    id: "left-join",
    name: "Left Join",
    description: "Return all records from the left table and matched records from the right table",
    category: "join",
    naturalLanguage: "Show me all records from {table1} and matching records from {table2}",
    sqlTemplate: "SELECT * FROM {table1} LEFT JOIN {table2} ON {table1}.{column1} = {table2}.{column2};",
    parameters: [
      {
        name: "table1",
        description: "Left table",
        type: "select",
        options: ["customers", "orders", "products", "employees", "regions"],
        default: "customers",
      },
      {
        name: "column1",
        description: "Column from left table",
        type: "text",
        default: "id",
      },
      {
        name: "table2",
        description: "Right table",
        type: "select",
        options: ["orders", "customers", "products", "employees", "regions"],
        default: "orders",
      },
      {
        name: "column2",
        description: "Column from right table",
        type: "text",
        default: "customer_id",
      },
    ],
  },

  // Advanced Queries
  {
    id: "subquery",
    name: "Subquery",
    description: "Use a query within another query",
    category: "advanced",
    naturalLanguage:
      "Show me records from {outer_table} where {outer_column} is in the results of a subquery on {inner_table}",
    sqlTemplate:
      "SELECT * FROM {outer_table} WHERE {outer_column} IN (SELECT {inner_column} FROM {inner_table} WHERE {condition});",
    parameters: [
      {
        name: "outer_table",
        description: "Outer table",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "outer_column",
        description: "Column from outer table",
        type: "text",
        default: "category",
      },
      {
        name: "inner_table",
        description: "Inner table",
        type: "select",
        options: ["categories", "products", "customers", "orders", "employees"],
        default: "categories",
      },
      {
        name: "inner_column",
        description: "Column from inner table",
        type: "text",
        default: "name",
      },
      {
        name: "condition",
        description: "Condition for inner query",
        type: "text",
        default: "is_active = true",
      },
    ],
  },
  {
    id: "case-statement",
    name: "Case Statement",
    description: "Use conditional logic in a query",
    category: "advanced",
    naturalLanguage: "Show me records from {table} with a calculated column based on {column}",
    sqlTemplate: `SELECT *,
  CASE
    WHEN {column} {condition1} THEN '{result1}'
    WHEN {column} {condition2} THEN '{result2}'
    ELSE '{default_result}'
  END AS {new_column}
FROM {table};`,
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "column",
        description: "Column to evaluate",
        type: "text",
        default: "price",
      },
      {
        name: "condition1",
        description: "First condition",
        type: "text",
        default: "> 100",
      },
      {
        name: "result1",
        description: "Result for first condition",
        type: "text",
        default: "Premium",
      },
      {
        name: "condition2",
        description: "Second condition",
        type: "text",
        default: "> 50",
      },
      {
        name: "result2",
        description: "Result for second condition",
        type: "text",
        default: "Standard",
      },
      {
        name: "default_result",
        description: "Default result",
        type: "text",
        default: "Budget",
      },
      {
        name: "new_column",
        description: "Name for the new column",
        type: "text",
        default: "price_category",
      },
    ],
  },

  // Modification Queries
  {
    id: "insert-record",
    name: "Insert Record",
    description: "Add a new record to a table",
    category: "modification",
    naturalLanguage: "Add a new record to the {table} table",
    sqlTemplate: "INSERT INTO {table} ({columns}) VALUES ({values});",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "columns",
        description: "Comma-separated column names",
        type: "text",
        default: "name, price, category",
      },
      {
        name: "values",
        description: "Comma-separated values",
        type: "text",
        default: "'New Product', 99.99, 'Electronics'",
      },
    ],
  },
  {
    id: "update-records",
    name: "Update Records",
    description: "Modify existing records in a table",
    category: "modification",
    naturalLanguage: "Update records in the {table} table where {condition}",
    sqlTemplate: "UPDATE {table} SET {column} = {value} WHERE {condition};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "column",
        description: "Column to update",
        type: "text",
        default: "price",
      },
      {
        name: "value",
        description: "New value",
        type: "text",
        default: "99.99",
      },
      {
        name: "condition",
        description: "Condition for update",
        type: "text",
        default: 'category = "Electronics"',
      },
    ],
  },
  {
    id: "delete-records",
    name: "Delete Records",
    description: "Remove records from a table",
    category: "modification",
    naturalLanguage: "Delete records from the {table} table where {condition}",
    sqlTemplate: "DELETE FROM {table} WHERE {condition};",
    parameters: [
      {
        name: "table",
        description: "Table name",
        type: "select",
        options: ["products", "customers", "orders", "employees", "regions"],
        default: "products",
      },
      {
        name: "condition",
        description: "Condition for deletion",
        type: "text",
        default: "id > 1000",
      },
    ],
  },
]

// Helper function to get templates by category
export function getTemplatesByCategory(category: QueryTemplate["category"]) {
  return queryTemplates.filter((template) => template.category === category)
}

// Helper function to apply parameters to a template
export function applyTemplateParameters(template: QueryTemplate, parameters: Record<string, string | number>): string {
  let result = template.sqlTemplate

  // Replace each parameter in the template
  Object.entries(parameters).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, "g")
    result = result.replace(regex, String(value))
  })

  return result
}
