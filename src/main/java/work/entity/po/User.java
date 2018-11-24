package work.entity.po;

import lombok.Data;

@Data
public class User {

	/**
	 * This field was generated by MyBatis Generator. This field corresponds to the database column user.userid
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	private String userid;
	/**
	 * This field was generated by MyBatis Generator. This field corresponds to the database column user.username
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	private String username;
	
	private String password;
	/**
	 * This method was generated by MyBatis Generator. This method returns the value of the database column user.userid
	 * @return  the value of user.userid
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	public String getUserid() {
		return userid;
	}

	/**
	 * This method was generated by MyBatis Generator. This method sets the value of the database column user.userid
	 * @param userid  the value for user.userid
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	public void setUserid(String userid) {
		this.userid = userid == null ? null : userid.trim();
	}

	/**
	 * This method was generated by MyBatis Generator. This method returns the value of the database column user.username
	 * @return  the value of user.username
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * This method was generated by MyBatis Generator. This method sets the value of the database column user.username
	 * @param username  the value for user.username
	 * @mbg.generated  Thu Nov 22 16:18:47 CST 2018
	 */
	public void setUsername(String username) {
		this.username = username == null ? null : username.trim();
	}
}