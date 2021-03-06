const gql = require('../gql');
module.exports = gql`
  type Patrol implements Node {
    id: ID!
    _id: ID!
    patrolNumber: String!
    groupName: String!
    patrolName: String!
    subcamp: Subcamp
    numberOfScouts: Int!
    numberOfScouters: Int!
    totalUnitSize: Int!
    fullyPaid: Boolean!
    finalPaymentDate: GraphQLDate
    patrolScouter: PatrolScouter
    adventureSelection: PatrolAdventureSelection
    schedule: PatrolSchedule
    scheduleRank: Int
    fullyScheduled: Boolean
    numberOfFreePeriods: Int
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
