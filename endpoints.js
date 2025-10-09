/**
 * Input: username <string>
 * Output: groups <string[]>
 * Description: This endpoint retrieves the groups associated with a given username.
 * GET /api/groups?username=<username>
 */

/**
 * Input: groupname <string>, usernames <string[]>, creationDate <Date> (implicit)
 * Output: success <boolean>
 * Description: This endpoint creates a new group with the given name and members.
 * POST /api/groups
 */

/**
 * Input: groupname <string>
 * Output: members <string[]>
 * Description: This endpoint retrieves the members of a given group.
 * GET /api/groups?groupname=<groupname>/members
 */

/**
 * Input: groupname <string>
 * Output: success <boolean>
 * Description: This endpoint deletes a group with the given name.
 * DELETE /api/groups?groupname=<groupname>
 */

/**
 * Input: groupname <string>, username <string>
 * Output: success <boolean>
 * Description: This endpoint adds a user to a given group.
 * POST /api/groups/members
 */

/**
 * Input: groupname <string>, username <string>
 * Output: success <boolean>
 * Description: This endpoint removes a user from a given group.
 * DELETE /api/groups/members?groupname=<groupname>&username=<username>
 */
