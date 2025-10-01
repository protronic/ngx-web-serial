export class MockSerial {
    constructor(responseFunction) {
        this.readableController = null;
        this.responseFunction = responseFunction;
        this.readableStream = new ReadableStream({
            start: (controller) => {
                this.readableController = controller;
            },
            cancel: () => {
                this.readableController = null;
            }
        });
    }
    requestPort(options) {
        return Promise.resolve({
            open: () => Promise.resolve(),
            close: () => this.readableStream.cancel(),
            readable: this.readableStream,
            writable: new WritableStream({
                write: (chunk) => {
                    const input = new TextDecoder().decode(chunk);
                    const response = this.responseFunction(input);
                    if (this.readableController) {
                        this.readableController.enqueue(new TextEncoder().encode(response));
                    }
                }
            })
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay1zZXJpYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtd2ViLXNlcmlhbC9zcmMvbGliL21vY2stc2VyaWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxVQUFVO0lBSXJCLFlBQVksZ0JBQTJDO1FBSC9DLHVCQUFrQixHQUF1RCxJQUFJLENBQUM7UUFJcEYsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUM7WUFDdkMsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUM7WUFDdkMsQ0FBQztZQUNELE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFrQztRQUM1QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDckIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDN0IsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQ3pDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYztZQUM3QixRQUFRLEVBQUUsSUFBSSxjQUFjLENBQUM7Z0JBQzNCLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNmLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzlDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7d0JBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEUsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQztTQUNrQixDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIE1vY2tTZXJpYWwge1xuICBwcml2YXRlIHJlYWRhYmxlQ29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxVaW50OEFycmF5PiB8IG51bGwgPSBudWxsO1xuICByZWFkb25seSByZXNwb25zZUZ1bmN0aW9uOiAoaW5wdXQ6IHN0cmluZykgPT4gc3RyaW5nO1xuICByZWFkb25seSByZWFkYWJsZVN0cmVhbTogUmVhZGFibGVTdHJlYW08VWludDhBcnJheT47XG4gIGNvbnN0cnVjdG9yKHJlc3BvbnNlRnVuY3Rpb246IChpbnB1dDogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlc3BvbnNlRnVuY3Rpb24gPSByZXNwb25zZUZ1bmN0aW9uO1xuICAgIHRoaXMucmVhZGFibGVTdHJlYW0gPSBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgICAgc3RhcnQ6IChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgIHRoaXMucmVhZGFibGVDb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgIH0sXG4gICAgICBjYW5jZWw6ICgpID0+IHtcbiAgICAgICAgdGhpcy5yZWFkYWJsZUNvbnRyb2xsZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVxdWVzdFBvcnQob3B0aW9ucz86IFNlcmlhbFBvcnRSZXF1ZXN0T3B0aW9ucyk6IFByb21pc2U8U2VyaWFsUG9ydD4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgb3BlbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgICBjbG9zZTogKCkgPT4gdGhpcy5yZWFkYWJsZVN0cmVhbS5jYW5jZWwoKSxcbiAgICAgIHJlYWRhYmxlOiB0aGlzLnJlYWRhYmxlU3RyZWFtLFxuICAgICAgd3JpdGFibGU6IG5ldyBXcml0YWJsZVN0cmVhbSh7XG4gICAgICAgIHdyaXRlOiAoY2h1bmspID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShjaHVuayk7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLnJlc3BvbnNlRnVuY3Rpb24oaW5wdXQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlYWRhYmxlQ29udHJvbGxlcikge1xuICAgICAgICAgICAgdGhpcy5yZWFkYWJsZUNvbnRyb2xsZXIuZW5xdWV1ZShuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocmVzcG9uc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBhcyBhbnkgYXMgU2VyaWFsUG9ydCk7XG4gIH1cbn1cbiJdfQ==