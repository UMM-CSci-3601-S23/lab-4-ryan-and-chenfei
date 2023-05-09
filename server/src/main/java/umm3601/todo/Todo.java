package umm3601.todo;

import org.mongojack.Id;
import org.mongojack.ObjectId;

// Have to convert properties to an object id to be stored in the database.

@SuppressWarnings({"VisibilityModifier"})
public class Todo {
  @SuppressWarnings({"MemberName"})
  @ObjectId @Id
  public String _id;
  public String owner;
  public boolean status;
  public String body;
  public String category;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Todo)) {
      return false;
    }
    Todo other = (Todo) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    // This means that equal Users will hash the same, which is good.
    return _id.hashCode();
  }

}
